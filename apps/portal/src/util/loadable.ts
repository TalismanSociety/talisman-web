import { bind } from "@react-rxjs/core"
import { catchError, map, type Observable, of, Subject, startWith, switchMap, tap } from "rxjs"

export type Loadable<T> =
	| { status: "loading" }
	| { status: "success"; data: T }
	| { status: "error"; error: unknown }

export const LOADING: Loadable<never> = { status: "loading" }

const toSettled = <T>(source$: Observable<T>): Observable<Loadable<T>> =>
	source$.pipe(
		map((data): Loadable<T> => ({ status: "success", data })),
		catchError((error) => of<Loadable<T>>({ status: "error", error }))
	)

export const toLoadable = <T>(source$: Observable<T>): Observable<Loadable<T>> =>
	toSettled(source$).pipe(startWith(LOADING))

const settledData = <T>(loadable: Loadable<T>): T => {
	if (loadable.status === "error") throw loadable.error
	if (loadable.status === "loading") throw new Error("A settled stream cannot be loading")
	return loadable.data
}

const retriesByError = new WeakMap<object, Set<() => void>>()

const isRetryable = (error: unknown): error is object => typeof error === "object" && error !== null

const rememberRetry = (error: unknown, retry: () => void) => {
	if (!isRetryable(error)) return
	const retries = retriesByError.get(error) ?? new Set()
	retries.add(retry)
	retriesByError.set(error, retries)
}

export const retryStreamError = (error: unknown) => {
	if (!isRetryable(error)) return
	for (const retry of retriesByError.get(error) ?? []) retry()
}

const retryable = <T>(source: () => Observable<T>): Observable<Loadable<T>> => {
	const retry$ = new Subject<void>()
	return retry$.pipe(
		startWith(undefined),
		switchMap(() => toSettled(source())),
		tap((loadable) => {
			if (loadable.status === "error") rememberRetry(loadable.error, () => retry$.next())
		})
	)
}

export const bindSuspended = <Args extends unknown[], T>(
	factory: (...args: Args) => Observable<T>
) => {
	const [useLoadable, loadable$] = bind((...args: Args) => retryable(() => factory(...args)))
	const useSettled = useLoadable as unknown as (...args: Args) => Loadable<T>
	const settled$ = loadable$ as unknown as (...args: Args) => Observable<Loadable<T>>
	const useValue = (...args: Args): T => settledData(useSettled(...args))
	const value$ = (...args: Args): Observable<T> => settled$(...args).pipe(map(settledData))
	return [useValue, value$] as const
}
