import { defer, type Observable, type ObservableInput, shareReplay } from "rxjs"

const CACHE = new Map<string, Observable<unknown>>()

export const getCachedQuery$ = <T>(
	namespace: string,
	key: string,
	query: () => ObservableInput<T>
): Observable<T> => {
	const cacheKey = `${namespace}::${key}`
	const cached = CACHE.get(cacheKey)
	if (cached) return cached as Observable<T>
	const query$ = defer(query).pipe(shareReplay(1))
	CACHE.set(cacheKey, query$)
	return query$
}
