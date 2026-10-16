import { bind } from "@react-rxjs/core"
import { catchError, map, type Observable, of, startWith } from "rxjs"

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

export const bindSuspended = <Args extends unknown[], T>(
	factory: (...args: Args) => Observable<T>
) => {
	const [useLoadable, loadable$] = bind((...args: Args) => toSettled(factory(...args)))
	const useSettled = useLoadable as unknown as (...args: Args) => Loadable<T>
	const settled$ = loadable$ as unknown as (...args: Args) => Observable<Loadable<T>>
	const useValue = (...args: Args): T => {
		const loadable = useSettled(...args)
		if (loadable.status === "error") throw loadable.error
		if (loadable.status === "loading") throw new Error("A settled stream cannot be loading")
		return loadable.data
	}
	const value$ = (...args: Args): Observable<T> =>
		settled$(...args).pipe(
			map((loadable) => {
				if (loadable.status === "error") throw loadable.error
				if (loadable.status === "loading") throw new Error("A settled stream cannot be loading")
				return loadable.data
			})
		)
	return [useValue, value$] as const
}
