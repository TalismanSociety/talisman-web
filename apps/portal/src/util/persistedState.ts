import { BehaviorSubject, skip } from "rxjs"
import type { z } from "zod"

const PERSISTED_KEYS = [
	"connected-substrate-extension",
	"readonly_accounts",
	"selected-currency",
	"EnableTestnets",
] as const

export type PersistedKey = (typeof PERSISTED_KEYS)[number]

type StorageArea = "local" | "session"

const storageOf = (area: StorageArea): Storage | undefined =>
	area === "session"
		? typeof sessionStorage === "undefined"
			? undefined
			: sessionStorage
		: typeof localStorage === "undefined"
			? undefined
			: localStorage

const write = (storage: Storage, key: PersistedKey, value: unknown) => {
	if (value === undefined) storage.removeItem(key)
	else storage.setItem(key, JSON.stringify(value))
}

const read = <T>(storage: Storage, key: PersistedKey, schema: z.ZodType<T>, defaultValue: T): T => {
	const stored = storage.getItem(key)
	if (stored === null) return defaultValue
	try {
		const parsed = schema.safeParse(JSON.parse(stored))
		return parsed.success ? parsed.data : defaultValue
	} catch {
		return defaultValue
	}
}

export const persistedState = <T>(
	key: PersistedKey,
	schema: z.ZodType<T>,
	defaultValue: T,
	area: StorageArea = "local"
) => {
	const storage = storageOf(area)
	if (storage === undefined) return new BehaviorSubject(defaultValue)
	const subject = new BehaviorSubject<T>(read(storage, key, schema, defaultValue))
	subject.pipe(skip(1)).subscribe((value) => write(storage, key, value))
	return subject
}
