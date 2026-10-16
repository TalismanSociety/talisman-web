import { beforeEach, describe, expect, it, vi } from "vitest"
import { networks } from "../../../public/chaindata.json"

const { createWsClient } = vi.hoisted(() => ({
	createWsClient: vi.fn((rpcs: string | string[], _options?: object) => ({ rpcs })),
}))

vi.mock("polkadot-api/ws", () => ({ createWsClient }))

const substrate = networks.flatMap((network) =>
	"genesisHash" in network && typeof network.genesisHash === "string"
		? [{ genesisHash: network.genesisHash, rpcs: network.rpcs }]
		: []
)
const [chain, otherChain] = substrate
if (!chain || !otherChain) throw new Error("two shipped substrate networks are required")

const load = async () => {
	vi.resetModules()
	createWsClient.mockClear()
	return import("./papi-client")
}

describe("getPapiClient", () => {
	let papi: Awaited<ReturnType<typeof load>>
	beforeEach(async () => {
		papi = await load()
	})

	it("opens one client per chain, on the shipped RPC list, with the shared metadata cache", () => {
		const first = papi.getPapiClient(chain.genesisHash)
		const second = papi.getPapiClient(chain.genesisHash)
		papi.getPapiClient(otherChain.genesisHash)

		expect(second).toBe(first)
		const metadataCache = expect.objectContaining({
			getMetadata: expect.any(Function),
			setMetadata: expect.any(Function),
		})
		expect(createWsClient.mock.calls).toEqual([
			[chain.rpcs, metadataCache],
			[otherChain.rpcs, metadataCache],
		])
		expect(createWsClient.mock.calls[0]?.[1]).toBe(createWsClient.mock.calls[1]?.[1])
	})

	it("opens nothing until a chain is asked for", () => {
		expect(createWsClient).not.toHaveBeenCalled()
	})

	it("refuses a chain the shipped chaindata does not know", () => {
		expect(() => papi.getPapiClient("0x0000")).toThrow("No RPC known for chain 0x0000")
		expect(createWsClient).not.toHaveBeenCalled()
	})
})
