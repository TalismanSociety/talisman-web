import { bind, SUSPENSE } from "@react-rxjs/core"
import {
	catchError,
	concat,
	filter,
	map,
	type Observable,
	of,
	Subject,
	startWith,
	switchMap,
	tap,
} from "rxjs"

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

export const loadableData = <T>(loadable: Loadable<T>): T | undefined =>
	loadable.status === "success" ? loadable.data : undefined

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

type Settling<T> = Loadable<T> | typeof SUSPENSE

const isSettled = <T>(value: Settling<T>): value is Loadable<T> => value !== SUSPENSE

const retryable = <T>(source: () => Observable<T>): Observable<Settling<T>> => {
	const retry$ = new Subject<void>()
	return retry$.pipe(
		startWith(undefined),
		switchMap(() => concat(of(SUSPENSE), toSettled(source()))),
		tap((value) => {
			if (isSettled(value) && value.status === "error")
				rememberRetry(value.error, () => retry$.next())
		})
	)
}

export const bindSuspended = <Args extends unknown[], T>(
	factory: (...args: Args) => Observable<T>
) => {
	const [useSettling, settling$] = bind((...args: Args) => retryable(() => factory(...args)))
	const useSettled = useSettling as unknown as (...args: Args) => Loadable<T>
	const settled$ = settling$ as unknown as (...args: Args) => Observable<Settling<T>>
	const useValue = (...args: Args): T => settledData(useSettled(...args))
	const value$ = (...args: Args): Observable<T> =>
		settled$(...args).pipe(filter(isSettled), map(settledData))
	return [useValue, value$] as const
}
