import { catchError, map, type Observable, of, startWith } from "rxjs"

export type Loadable<T> =
	| { status: "loading" }
	| { status: "success"; data: T }
	| { status: "error"; error: unknown }

export const LOADING: Loadable<never> = { status: "loading" }

export const toLoadable = <T>(source$: Observable<T>): Observable<Loadable<T>> =>
	source$.pipe(
		map((data): Loadable<T> => ({ status: "success", data })),
		startWith(LOADING),
		catchError((error) => of<Loadable<T>>({ status: "error", error }))
	)
