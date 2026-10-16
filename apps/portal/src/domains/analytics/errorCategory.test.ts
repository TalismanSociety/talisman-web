import { describe, expect, it } from "vitest"
import { HarmlessError } from "@/domains/common/errors"
import { classifyError, isIgnoredError } from "./errorCategory"

const named = (name: string, message = "boom") => Object.assign(new Error(message), { name })

describe("classifyError", () => {
	it.each([
		["a wallet rejection by name", named("UserRejectedRequestError"), "user_rejected"],
		[
			"a wallet rejection by code",
			Object.assign(new Error("boom"), { code: 4001 }),
			"user_rejected",
		],
		["an extension cancel", new Error("Cancelled"), "user_rejected"],
		["a polkadot-js rejection", new Error("Rejected by user"), "user_rejected"],
		["a chunk load error", named("ChunkLoadError"), "chunk_load"],
		[
			"a failed dynamic import",
			new TypeError("Failed to fetch dynamically imported module: https://x/assets/a.js"),
			"chunk_load",
		],
		["a failed fetch", new TypeError("Failed to fetch"), "network"],
		["a Safari failed fetch", new TypeError("Load failed"), "network"],
		["a rate limit", Object.assign(new Error("boom"), { status: 429 }), "network"],
		["an RPC error by name", named("RpcRequestError"), "network"],
		["a timeout by name", named("TimeoutError"), "timeout"],
		["a timeout by message", new Error("Request timed out"), "timeout"],
		["an indexer status error", new Error("GraphQL Error (Code: 500): {}"), "indexer"],
		["a rejected transaction", new Error("Invalid transaction: Payment"), "tx_rejected"],
		[
			"a node's rejected transaction",
			new Error("1010: Invalid Transaction: Inability to pay some fees"),
			"tx_rejected",
		],
		["a failed extrinsic", new Error("ExtrinsicFailed"), "tx_rejected"],
		["invalid input", named("ZodError"), "input_invalid"],
		["a full storage", named("QuotaExceededError"), "storage"],
		["an unsupported browser feature", named("NotSupportedError"), "unsupported"],
		[
			"a cause that carries the category",
			new Error("outer", { cause: new TypeError("Failed to fetch") }),
			"network",
		],
		["a string", "Cancelled", "user_rejected"],
		["anything else", new Error("Transfer from Alice failed"), "unknown"],
		["null", null, "unknown"],
		["a number", 42, "unknown"],
	])("classifies %s", (_, error, category) => {
		expect(classifyError(error)).toBe(category)
	})

	it("reads at most six layers of causes", () => {
		let error: unknown = new TypeError("Failed to fetch")
		for (let i = 0; i < 6; i++) error = new Error("outer", { cause: error })
		expect(classifyError(error)).toBe("unknown")
	})

	it("returns unknown when reading the thrown value throws", () => {
		const hostile = new Proxy(
			{},
			{
				get: () => {
					throw new Error("trap")
				},
			}
		)
		expect(classifyError(hostile)).toBe("unknown")
	})
})

describe("isIgnoredError", () => {
	it.each([
		["a harmless error", new HarmlessError("Please ignore this message")],
		["a harmless error wrapping a cancel", new HarmlessError(new Error("Cancelled"))],
		[
			"a socket closed normally",
			new Error("disconnected from wss://rpc.polkadot.io: 1000:: Normal Closure"),
		],
		[
			"a socket closed normally, in parentheses",
			new Error("API-WS: disconnected from wss(://rpc.polkadot.io: 1000:: Normal Closure)"),
		],
		[
			"a socket closed abnormally",
			new Error("disconnected from wss://rpc.polkadot.io: 1006:: Abnormal Closure"),
		],
		["an unsubscription", new Error("unsubscribed from wss://rpc.polkadot.io: 1000:: Normal")],
		[
			"an extension that is gone",
			new Error("Could not establish connection. Receiving end does not exist."),
		],
		["a rejected string", "disconnected from wss://rpc.polkadot.io: 1000:: Normal Closure"],
	])("ignores %s", (_, error) => {
		expect(isIgnoredError(error)).toBe(true)
	})

	it.each([
		["an error", new Error("Transfer from Alice failed")],
		["an error that wraps a harmless one", new Error("outer", { cause: new HarmlessError("x") })],
		["a disconnection mid-message", new Error("RPC disconnected from wss://x: 1000:: Normal")],
		["null", null],
		["a number", 42],
	])("reports %s", (_, error) => {
		expect(isIgnoredError(error)).toBe(false)
	})
})
