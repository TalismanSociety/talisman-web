import { HarmlessError } from "@/domains/common/errors"

export const ERROR_CATEGORIES = [
	"user_rejected",
	"network",
	"timeout",
	"input_invalid",
	"storage",
	"unsupported",
	"chunk_load",
	"indexer",
	"tx_rejected",
	"unknown",
] as const

export type ErrorCategory = (typeof ERROR_CATEGORIES)[number]

type CategoryRule =
	| { readonly match: "name"; readonly names: readonly string[]; readonly category: ErrorCategory }
	| {
			readonly match: "code"
			readonly codes: readonly (number | string)[]
			readonly category: ErrorCategory
	  }
	| { readonly match: "message"; readonly pattern: RegExp; readonly category: ErrorCategory }

const CATEGORY_RULES: readonly CategoryRule[] = [
	{
		match: "name",
		names: ["UserRejectedRequestError", "NotAllowedError"],
		category: "user_rejected",
	},
	{ match: "name", names: ["ChunkLoadError"], category: "chunk_load" },
	{
		match: "name",
		names: [
			"HttpRequestError",
			"RpcRequestError",
			"WebSocketRequestError",
			"SocketClosedError",
			"NetworkError",
		],
		category: "network",
	},
	{ match: "name", names: ["TimeoutError"], category: "timeout" },
	{ match: "name", names: ["ZodError"], category: "input_invalid" },
	{
		match: "name",
		names: ["SecurityError", "NotSupportedError", "ConstraintError"],
		category: "unsupported",
	},
	{ match: "name", names: ["QuotaExceededError", "DataCloneError"], category: "storage" },
	{ match: "code", codes: [4001, "ACTION_REJECTED"], category: "user_rejected" },
	{ match: "code", codes: [4100, 4200], category: "unsupported" },
	{ match: "code", codes: [429], category: "network" },
	{
		match: "message",
		pattern: /^(cancell?ed|rejected)$|user (rejected|denied|cancell?ed)|rejected by (the )?user/i,
		category: "user_rejected",
	},
	{
		match: "message",
		pattern:
			/failed to fetch dynamically imported module|importing a module script failed|error loading dynamically imported module/i,
		category: "chunk_load",
	},
	{ match: "message", pattern: /^GraphQL Error \(Code: \d+\)/, category: "indexer" },
	{
		match: "message",
		pattern: /^(\d+: )?(Invalid|Unknown) transaction: |dispatch error|extrinsicfailed/i,
		category: "tx_rejected",
	},
	{ match: "message", pattern: /^timeout$|timed? ?out/i, category: "timeout" },
	{
		match: "message",
		pattern: /failed to fetch|fetch failed|networkerror|load failed|too many requests|websocket/i,
		category: "network",
	},
]

const MAX_CAUSE_DEPTH = 5

const layersOf = (error: unknown): unknown[] => {
	const layers: unknown[] = []
	for (let layer = error; layer != null && layers.length <= MAX_CAUSE_DEPTH; ) {
		layers.push(layer)
		layer = typeof layer === "object" ? (layer as { cause?: unknown }).cause : undefined
	}
	return layers
}

const read = (layer: unknown, key: PropertyKey): unknown =>
	typeof layer === "object" && layer !== null
		? (layer as Record<PropertyKey, unknown>)[key]
		: undefined

const messageOf = (layer: unknown) => {
	if (typeof layer === "string") return layer
	const message = read(layer, "message")
	return typeof message === "string" ? message : undefined
}

const categoryOfLayer = (rule: CategoryRule, layer: unknown): ErrorCategory | undefined => {
	switch (rule.match) {
		case "name":
			return rule.names.includes(read(layer, "name") as string) ? rule.category : undefined
		case "code": {
			const codes = [read(layer, "code"), read(layer, "status")]
			return codes.some((code) => rule.codes.includes(code as number | string))
				? rule.category
				: undefined
		}
		case "message": {
			const message = messageOf(layer)
			return message !== undefined && rule.pattern.test(message) ? rule.category : undefined
		}
	}
}

export const classifyError = (error: unknown): ErrorCategory => {
	try {
		const layers = layersOf(error)
		for (const rule of CATEGORY_RULES)
			for (const layer of layers) {
				const category = categoryOfLayer(rule, layer)
				if (category) return category
			}
	} catch {}
	return "unknown"
}

const IGNORED_MESSAGES: readonly RegExp[] = [
	/(disconnected from wss)[(]?:\/\/[\w./:-]+: \d+:: Normal Closure[)]?/,
	/^disconnected from .+: [0-9]+:: .+$/,
	/^unsubscribed from .+: [0-9]+:: .+$/,
	/(Could not establish connection. Receiving end does not exist.)/,
]

export const isIgnoredError = (error: unknown) => {
	try {
		if (error instanceof HarmlessError) return true
		const message = messageOf(error)
		return message !== undefined && IGNORED_MESSAGES.some((pattern) => pattern.test(message))
	} catch {
		return false
	}
}
