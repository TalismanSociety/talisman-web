import { BehaviorSubject, skip } from "rxjs"
import type { z } from "zod"

const PERSISTED_KEYS = ["connected-substrate-extension", "readonly_accounts"] as const

export type PersistedKey = (typeof PERSISTED_KEYS)[number]

const write = (key: PersistedKey, value: unknown) => {
	if (value === undefined) localStorage.removeItem(key)
	else localStorage.setItem(key, JSON.stringify(value))
}

const read = <T>(key: PersistedKey, schema: z.ZodType<T>, defaultValue: T): T => {
	const stored = localStorage.getItem(key)
	if (stored === null) return defaultValue
	try {
		const parsed = schema.safeParse(JSON.parse(stored))
		return parsed.success ? parsed.data : defaultValue
	} catch {
		return defaultValue
	}
}

export const persistedState = <T>(key: PersistedKey, schema: z.ZodType<T>, defaultValue: T) => {
	if (typeof localStorage === "undefined") return new BehaviorSubject(defaultValue)
	const subject = new BehaviorSubject<T>(read(key, schema, defaultValue))
	subject.pipe(skip(1)).subscribe((value) => write(key, value))
	return subject
}
