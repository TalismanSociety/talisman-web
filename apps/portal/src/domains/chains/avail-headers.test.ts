// @vitest-environment node
import { Blake2256, compact } from "@polkadot-api/substrate-bindings"
import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"
import type { Middleware } from "@polkadot-api/ws-provider"
import { describe, expect, it } from "vitest"

import { foldAvailExtension, withAvailHeaders } from "./avail-headers"
import header from "./fixtures/avail-header.json"

const BLOCK_HASH = "0x60904d529497bc885eff4a6b5ebf2fd9f7f6ead1f0d299d553fabdfc4f6cbbfd"

type Base = Parameters<Middleware>[0]
type Message = Parameters<Parameters<Base>[0]>[0]
type Request = Parameters<ReturnType<Base>["send"]>[0]

const legacyMiddlewareHash = ({
	parentHash,
	number,
	stateRoot,
	extrinsicsRoot,
	digest,
}: typeof header) =>
	toHex(
		Blake2256(
			mergeUint8([
				fromHex(parentHash),
				compact.enc(Number(number)),
				fromHex(stateRoot),
				fromHex(extrinsicsRoot),
				compact.enc(digest.logs.length),
				...digest.logs.map(fromHex),
			])
		)
	)

const fakeProvider = () => {
	const sent: Request[] = []
	let listener: (message: Message) => void = () => {}
	const base: Base = (onMessage) => {
		listener = onMessage
		return { send: (message) => sent.push(message), disconnect: () => {} }
	}
	return { base, sent, receive: (message: Message) => listener(message) }
}

describe("Avail headers", () => {
	it("hashes to the block hash only once the extension is folded into the last log", () => {
		expect(legacyMiddlewareHash(header)).not.toBe(BLOCK_HASH)
		expect(legacyMiddlewareHash(foldAvailExtension(header))).toBe(BLOCK_HASH)
		expect(foldAvailExtension(header)).not.toHaveProperty("extension")
	})

	it("folds subscription headers and chain_getHeader answers, and leaves other messages alone", () => {
		const { base, sent, receive } = fakeProvider()
		const received: Message[] = []
		const provider = withAvailHeaders(base)(
			(message) => received.push(message),
			() => {}
		)

		receive({
			jsonrpc: "2.0",
			method: "chain_finalizedHead",
			params: { subscription: "s", result: header },
		})
		provider.send({ jsonrpc: "2.0", id: "1-7", method: "chain_getHeader", params: [BLOCK_HASH] })
		receive({ jsonrpc: "2.0", id: "1-7", result: header })
		provider.send({ jsonrpc: "2.0", id: "1-8", method: "chain_getBlockHash", params: [1] })
		receive({ jsonrpc: "2.0", id: "1-8", result: BLOCK_HASH })

		expect(sent).toHaveLength(2)
		const [subscription, answer, blockHash] = received as unknown as [
			{ params: { result: typeof header } },
			{ result: typeof header },
			{ result: string },
		]
		expect(legacyMiddlewareHash(subscription.params.result)).toBe(BLOCK_HASH)
		expect(legacyMiddlewareHash(answer.result)).toBe(BLOCK_HASH)
		expect(blockHash.result).toBe(BLOCK_HASH)
	})
})
