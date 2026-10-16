import {
	_void,
	Bytes,
	compact,
	Struct,
	u8,
	Variant,
	Vector,
} from "@polkadot-api/substrate-bindings"
import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"
import type { Middleware } from "@polkadot-api/ws-provider"

type JsonHeader = {
	digest: { logs: string[] }
	extension?: {
		V3?: {
			appLookup: { size: number; index: { appId: number; start: number }[] }
			commitment: { rows: number; cols: number; commitment: number[]; dataRoot: string }
		}
	}
}

const HeaderExtension = Variant({
	V1: _void,
	V2: _void,
	V3: Struct({
		appLookup: Struct({ size: compact, index: Vector(Struct({ appId: compact, start: compact })) }),
		commitment: Struct({
			rows: compact,
			cols: compact,
			commitment: Vector(u8),
			dataRoot: Bytes(32),
		}),
	}),
})

const encodeExtension = (extension: NonNullable<JsonHeader["extension"]>) => {
	const v3 = extension.V3
	if (!v3) throw new Error(`Unsupported Avail header extension ${Object.keys(extension).join()}`)
	return HeaderExtension.enc({
		type: "V3",
		value: {
			appLookup: v3.appLookup,
			commitment: { ...v3.commitment, dataRoot: fromHex(v3.commitment.dataRoot) },
		},
	})
}

export const foldAvailExtension = <T extends JsonHeader>(header: T): T => {
	if (!header.extension || header.digest.logs.length === 0) return header
	const logs = [...header.digest.logs]
	const last = logs.length - 1
	logs[last] = toHex(mergeUint8(fromHex(logs[last]!), encodeExtension(header.extension)))
	const { extension: _, ...rest } = header
	return { ...rest, digest: { logs } } as T
}

const HEADER_SUBSCRIPTIONS = new Set(["chain_allHead", "chain_newHead", "chain_finalizedHead"])

type Message = Parameters<Parameters<Parameters<Middleware>[0]>[0]>[0]
type Request = Parameters<ReturnType<Parameters<Middleware>[0]>["send"]>[0]

const isHeader = (value: unknown): value is JsonHeader =>
	typeof value === "object" && value !== null && "digest" in value && "extension" in value

const fold = (message: Message, headerRequests: Set<string | number>): Message => {
	if ("method" in message) {
		const params = message.params as { subscription: string; result: unknown } | undefined
		return HEADER_SUBSCRIPTIONS.has(message.method) && params && isHeader(params.result)
			? { ...message, params: { ...params, result: foldAvailExtension(params.result) } }
			: message
	}
	if (
		message.id !== null &&
		headerRequests.delete(message.id) &&
		"result" in message &&
		isHeader(message.result)
	)
		return { ...message, result: foldAvailExtension(message.result) }
	return message
}

export const withAvailHeaders: Middleware = (base) => (onMessage, onHalt) => {
	const headerRequests = new Set<string | number>()
	const inner = base((message) => onMessage(fold(message, headerRequests)), onHalt)
	return {
		...inner,
		send: (message: Request) => {
			if (message.method === "chain_getHeader" && message.id != null) headerRequests.add(message.id)
			inner.send(message)
		},
	}
}
