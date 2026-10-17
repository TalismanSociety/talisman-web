import { Subscribe } from "@react-rxjs/core"
import type { ChaindataFile } from "@talismn/chaindata-provider"
import { act, render, renderHook, screen } from "@testing-library/react"
import type { ReactNode } from "react"
import { Suspense } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { COINS_API_URL, coinsApiReply } from "@/test/coins-api"

const MAINNET = `0x${"11".repeat(32)}` as const
const TESTNET = `0x${"22".repeat(32)}` as const

vi.mock("@/domains/chains/config", () => ({
	chainConfigs: [
		{
			genesisHash: MAINNET,
			hasNominationPools: true,
			priorityPool: 1,
			talismanPools: [1],
			novaIndexerUrl: "https://indexer.portal.test",
		},
		{ genesisHash: TESTNET, hasDappStaking: true, dappStakingApi: "", priorityDapp: undefined },
	],
	claimPermissionUnsupportedChainIds: [],
}))

const network = (id: string, genesisHash: `0x${string}`, isTestnet?: true) => ({
	id,
	name: `Portal ${id}`,
	platform: "polkadot" as const,
	nativeTokenId: `${id}:substrate-native`,
	nativeCurrency: { decimals: 10, symbol: "TST", name: "Test" },
	genesisHash,
	chainName: `Portal ${id}`,
	specName: id,
	specVersion: 1,
	account: "*25519" as const,
	prefix: 42,
	rpcs: [`wss://rpc.${id}.test`],
	topology: { type: "standalone" as const },
	blockExplorerUrls: [`https://${id}.subscan.io`],
	...(isTestnet ? { isTestnet } : {}),
})

const chaindata: ChaindataFile = {
	networks: [network("mainnet", MAINNET), network("testnet", TESTNET, true)],
	tokens: [
		{
			id: "mainnet:substrate-native",
			platform: "polkadot",
			networkId: "mainnet",
			type: "substrate-native",
			symbol: "TST",
			decimals: 10,
			name: "Test",
			existentialDeposit: "1",
			coingeckoId: "portal-coin",
		},
		{
			id: "testnet:substrate-native",
			platform: "polkadot",
			networkId: "testnet",
			type: "substrate-native",
			symbol: "TTST",
			decimals: 10,
			name: "Test",
			existentialDeposit: "1",
			coingeckoId: "testnet-coin",
		},
	],
	miniMetadatas: [],
}

const prices = { "portal-coin": { usd: 2.5, eur: 2 }, "testnet-coin": { usd: 9, eur: 9 } }

const fetchStub = () =>
	vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
		const url = String(input)
		if (url === `${location.origin}/chaindata.json`) return new Response(JSON.stringify(chaindata))
		if (url === COINS_API_URL) return coinsApiReply(init, prices)
		return new Response(null, { status: 404 })
	})

const wrapper = ({ children }: { children: ReactNode }) => (
	<Subscribe>
		<Suspense fallback={<p>Loading</p>}>{children}</Suspense>
	</Subscribe>
)

const load = async () => {
	vi.resetModules()
	return await import("./chains")
}

describe("chains", () => {
	let fetch: ReturnType<typeof fetchStub>

	beforeEach(() => {
		localStorage.clear()
		sessionStorage.clear()
		fetch = fetchStub()
		vi.stubGlobal("fetch", fetch)
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it("builds the chain from chaindata, the native token and the chain config", async () => {
		const { useChainOf } = await load()

		const { result } = renderHook(() => useChainOf(MAINNET), { wrapper })

		await vi.waitFor(() => expect(result.current).not.toBeNull())
		expect(result.current.id).toBe("mainnet")
		expect(result.current.nativeToken?.symbol).toBe("TST")
		expect(result.current.subscanUrl).toBe("https://mainnet.subscan.io")
		expect("priorityPool" in result.current ? result.current.priorityPool : undefined).toBe(1)
	})

	it("hides testnets until EnableTestnets is set, and stores the flag JSON-encoded in sessionStorage", async () => {
		const { useDappStakingEnabledChains, setEnableTestnets } = await load()

		const { result } = renderHook(() => useDappStakingEnabledChains(), { wrapper })

		await vi.waitFor(() => expect(result.current).not.toBeNull())
		expect(result.current.map((chain) => chain.id)).toEqual([])

		act(() => setEnableTestnets(true))

		await vi.waitFor(() => expect(result.current.map((chain) => chain.id)).toEqual(["testnet"]))
		expect(sessionStorage.getItem("EnableTestnets")).toBe("true")
	})

	it("reads EnableTestnets from sessionStorage on load", async () => {
		sessionStorage.setItem("EnableTestnets", "true")
		const { useNominationPoolsEnabledChains, useEnableTestnets } = await load()

		expect(renderHook(() => useEnableTestnets(), { wrapper }).result.current).toBe(true)
		const { result } = renderHook(() => useNominationPoolsEnabledChains(), { wrapper })
		await vi.waitFor(() => expect(result.current).not.toBeNull())
		expect(result.current.map((chain) => chain.id)).toEqual(["mainnet"])
	})

	it("prices the native token from the coins api and follows the selected currency", async () => {
		const { useNativeTokenPriceOf } = await load()
		const currency = await import("@/domains/balances/currency")

		const { result } = renderHook(() => useNativeTokenPriceOf(MAINNET), { wrapper })

		await vi.waitFor(() => expect(result.current).toBe(2.5))
		act(() => currency.setSelectedCurrency("eur"))
		await vi.waitFor(() => expect(result.current).toBe(2))
	})

	it("prices a token at 0 when the coins api fails, without throwing", async () => {
		fetch.mockImplementation(async (input: RequestInfo | URL) =>
			String(input) === `${location.origin}/chaindata.json`
				? new Response(JSON.stringify(chaindata))
				: new Response("down", { status: 503 })
		)
		const { useNativeTokenPriceOf } = await load()

		const { result } = renderHook(() => useNativeTokenPriceOf(MAINNET), { wrapper })

		await vi.waitFor(() => expect(result.current).toBe(0))
	})

	it("prices a testnet's native token at 0 though the coins api has a rate for it", async () => {
		const { useNativeTokenPriceOf } = await load()

		const { result } = renderHook(() => useNativeTokenPriceOf(TESTNET), { wrapper })

		await vi.waitFor(() => expect(result.current).toBe(0))
	})

	it("converts planck to a decimal and a localized fiat amount in the selected currency", async () => {
		const { useNativeTokenAmountOf } = await load()

		const { result } = renderHook(() => useNativeTokenAmountOf(MAINNET), { wrapper })

		await vi.waitFor(() => expect(result.current).not.toBeNull())
		const amount = result.current.fromPlanck(10n ** 10n)
		expect(amount.decimalAmount.toNumber()).toBe(1)
		expect(amount.decimalAmount.options?.currency).toBe("TST")
		expect(amount.fiatAmount).toBe(2.5)
		expect(amount.localizedFiatAmount).toBe("$2.50")
	})

	it("renders the chain through a Suspense fallback first, then the value", async () => {
		const { useChainOf } = await load()
		const Chain = () => <p>{useChainOf(MAINNET).name}</p>

		render(<Chain />, { wrapper })

		expect(screen.getByText("Loading")).toBeDefined()
		expect(await screen.findByText("Portal mainnet")).toBeDefined()
	})
})
