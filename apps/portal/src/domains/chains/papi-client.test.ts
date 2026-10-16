import { beforeEach, describe, expect, it, vi } from "vitest"
import { networks } from "../../../public/chaindata.json"

const { createWsClient, createClient, getWsProvider, withLegacy } = vi.hoisted(() => ({
	createWsClient: vi.fn((rpcs: string | string[], _options?: object) => ({ rpcs })),
	createClient: vi.fn((provider: object, _options?: object) => ({ provider })),
	getWsProvider: vi.fn((rpcs: string[], options: object) => ({ rpcs, options })),
	withLegacy: () => () => undefined,
}))

vi.mock("polkadot-api/ws", () => ({ createWsClient }))
vi.mock("polkadot-api", () => ({ createClient }))
vi.mock("@polkadot-api/ws-provider", () => ({ getWsProvider }))
vi.mock("@polkadot-api/ws-middleware", () => ({ withLegacy }))

const substrate = networks.flatMap((network) =>
	"genesisHash" in network && typeof network.genesisHash === "string" && network.id !== "bittensor"
		? [{ genesisHash: network.genesisHash, rpcs: network.rpcs }]
		: []
)
const bittensor = networks.find((network) => network.id === "bittensor")
if (!bittensor || !("genesisHash" in bittensor)) throw new Error("bittensor must be shipped")
const [chain, otherChain] = substrate
if (!chain || !otherChain) throw new Error("two shipped substrate networks are required")

const load = async () => {
	vi.resetModules()
	createWsClient.mockClear()
	createClient.mockClear()
	getWsProvider.mockClear()
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

	it("opens Bittensor through the legacy JSON-RPC translation, behind its load balancers", () => {
		const client = papi.getPapiClient(bittensor.genesisHash as string)

		expect(getWsProvider).toHaveBeenCalledWith(bittensor.rpcs, { middleware: withLegacy })
		expect(client).toEqual({
			provider: { rpcs: bittensor.rpcs, options: { middleware: withLegacy } },
		})
		expect(createClient.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				getMetadata: expect.any(Function),
				setMetadata: expect.any(Function),
			})
		)
		expect(createWsClient).not.toHaveBeenCalled()
	})

	it("opens nothing until a chain is asked for", () => {
		expect(createWsClient).not.toHaveBeenCalled()
	})

	it("refuses a chain the shipped chaindata does not know", () => {
		expect(() => papi.getPapiClient("0x0000")).toThrow("No RPC known for chain 0x0000")
		expect(createWsClient).not.toHaveBeenCalled()
	})
})
