import { z } from "zod"
import { ERROR_CATEGORIES, type ErrorCategory } from "./errorCategory"
import type { IsLoadedScript } from "./loadedScripts"

export const EXCEPTION_MECHANISMS = [
	"caught",
	"uncaught",
	"unhandled_rejection",
	"error_boundary",
] as const

export type ExceptionMechanism = (typeof EXCEPTION_MECHANISMS)[number]

const isHandledMechanism = (mechanism: ExceptionMechanism) =>
	mechanism === "caught" || mechanism === "error_boundary"

const MAX_ENTRIES = 10
const MAX_FRAMES = 50

const frameSchema = z.object({
	filename: z.string().optional(),
	lineno: z.int().nonnegative().optional(),
	colno: z.int().nonnegative().optional(),
	chunk_id: z.string().optional(),
})

type RawFrame = z.infer<typeof frameSchema>

const entrySchema = z.object({
	type: z.string().default("Error"),
	value: z.string().default(""),
	stacktrace: z.object({ frames: z.array(frameSchema).default([]) }).optional(),
	mechanism: z
		.object({
			synthetic: z.boolean().optional(),
			exception_id: z.int().nonnegative().optional(),
			parent_id: z.int().nonnegative().optional(),
			source: z.enum(["cause", "member"]).optional(),
		})
		.default({}),
})

const capturedSchema = z.object({
	$exception_list: z.array(entrySchema),
	error_category: z.enum(ERROR_CATEGORIES).catch("unknown"),
	mechanism: z.enum(EXCEPTION_MECHANISMS).catch("caught"),
})

const CHUNK_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const UNKNOWN_FUNCTION = "?"

type ExceptionFrame = {
	platform: "web:javascript"
	filename: string
	function: typeof UNKNOWN_FUNCTION
	lineno?: number
	colno?: number
	chunk_id?: string
	in_app: true
}

export const ownFrames = (
	frames: readonly RawFrame[],
	isLoadedScript: IsLoadedScript
): ExceptionFrame[] =>
	frames
		.filter(({ filename }) => filename !== undefined && isLoadedScript(filename))
		.slice(-MAX_FRAMES)
		.map(({ filename = "", lineno, colno, chunk_id }) => ({
			platform: "web:javascript",
			filename,
			function: UNKNOWN_FUNCTION,
			...(lineno !== undefined && { lineno }),
			...(colno !== undefined && { colno }),
			...(chunk_id !== undefined && CHUNK_ID.test(chunk_id) && { chunk_id }),
			in_app: true,
		}))

export const ERROR_CLASSES: ReadonlySet<string> = new Set([
	"Error",
	"TypeError",
	"RangeError",
	"SyntaxError",
	"ReferenceError",
	"EvalError",
	"URIError",
	"AggregateError",
	"DOMException",
	"AbortError",
	"TimeoutError",
	"NotAllowedError",
	"QuotaExceededError",
	"SecurityError",
	"NetworkError",
	"InvalidStateError",
	"ChunkLoadError",
])

export const errorClassOf = (type: string, synthetic = false) =>
	!synthetic && ERROR_CLASSES.has(type) ? type : "Error"

type ExceptionEntry = {
	type: string
	value: string
	stacktrace?: { type: "raw"; frames: ExceptionFrame[] }
	mechanism: {
		type: ExceptionMechanism | "chained"
		handled: boolean
		synthetic?: boolean
		exception_id: number
		parent_id?: number
		source?: "cause" | "member"
	}
}

export type ExceptionProperties = {
	$exception_list: ExceptionEntry[]
	$exception_level: "error"
	exception_type: string
	error_category: ErrorCategory
	mechanism: ExceptionMechanism
	handled: boolean
}

export const toExceptionProperties = (
	captured: Record<string, unknown>,
	isLoadedScript: IsLoadedScript,
	admit: (key: string) => boolean
): ExceptionProperties | undefined => {
	const parsed = capturedSchema.safeParse(captured)
	if (!parsed.success) return undefined
	const { $exception_list, error_category: category, mechanism } = parsed.data
	const [thrown] = $exception_list
	if (!thrown || !admit(`${thrown.type}: ${thrown.value}`)) return undefined

	const handled = isHandledMechanism(mechanism)
	const entries = $exception_list
		.slice(0, MAX_ENTRIES)
		.map(({ type, stacktrace, mechanism: entry }, index): ExceptionEntry => {
			const frames = ownFrames(stacktrace?.frames ?? [], isLoadedScript)
			return {
				type: errorClassOf(type, entry.synthetic),
				value: index === 0 ? category : "",
				...(frames.length > 0 && { stacktrace: { type: "raw", frames } }),
				mechanism: {
					type: index === 0 ? mechanism : "chained",
					handled,
					...(entry.synthetic !== undefined && { synthetic: entry.synthetic }),
					exception_id: entry.exception_id ?? index,
					...(entry.parent_id !== undefined && { parent_id: entry.parent_id }),
					...(entry.source !== undefined && { source: entry.source }),
				},
			}
		})
	return {
		$exception_list: entries,
		$exception_level: "error",
		exception_type: entries[0]?.type ?? "Error",
		error_category: category,
		mechanism,
		handled,
	}
}

export const EXCEPTION_THROTTLE = {
	windowMs: 10 * 60_000,
	perKey: 3,
	total: 30,
} as const

export const createExceptionThrottle = (
	limits: { [K in keyof typeof EXCEPTION_THROTTLE]: number } = EXCEPTION_THROTTLE
) => {
	let windowStart = Number.NEGATIVE_INFINITY
	let admitted = 0
	const counts = new Map<string, number>()
	return (key: string, now: number) => {
		if (now - windowStart >= limits.windowMs) {
			windowStart = now
			admitted = 0
			counts.clear()
		}
		const count = counts.get(key) ?? 0
		if (count >= limits.perKey || admitted >= limits.total) return false
		counts.set(key, count + 1)
		admitted++
		return true
	}
}
