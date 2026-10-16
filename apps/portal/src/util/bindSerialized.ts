import { type DefaultedStateObservable, state, useStateObservable } from "@react-rxjs/core"
import { useEffect } from "react"
import { defer, type Observable } from "rxjs"

const UNUSED_ENTRY_EVICTION_DELAY = 500

const serializeArgs = (args: unknown[]) =>
	JSON.stringify(args, (_, value) => (typeof value === "bigint" ? `bigint:${value}` : value))

export const bindSerialized = <Args extends unknown[], T>(
	getObservable: (...args: Args) => Observable<T>,
	getDefaultValue: (...args: Args) => T
) => {
	const cache = new Map<string, DefaultedStateObservable<T>>()

	const scheduleEviction = (key: string, entry: DefaultedStateObservable<T>) => {
		setTimeout(() => {
			if (cache.get(key) === entry && !entry.getRefCount()) cache.delete(key)
		}, UNUSED_ENTRY_EVICTION_DELAY)
	}

	const getEntry = (key: string, args: Args) => {
		const cached = cache.get(key)
		if (cached) return cached

		const entry = state(
			defer(() => getObservable(...args)),
			getDefaultValue(...args)
		)
		cache.set(key, entry)
		scheduleEviction(key, entry)
		return entry
	}

	return (...args: Args): T => {
		const key = serializeArgs(args)
		const entry = getEntry(key, args)

		useEffect(() => () => scheduleEviction(key, entry), [key, entry])

		return useStateObservable(entry) as T
	}
}
