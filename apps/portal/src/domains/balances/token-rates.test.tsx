import { Subscribe } from "@react-rxjs/core"
import type { ChaindataFile } from "@talismn/chaindata-provider"
import { act, renderHook } from "@testing-library/react"
import type { ReactNode } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { SEEK_TOKEN_ID } from "@/domains/staking/seek/constants"
import {
	COINS_API_URL,
	type CoinsApiPrices,
	coinsApiReply,
	coinsApiRequestOf,
} from "@/test/coins-api"

import { BALANCES_CACHE_KEY } from "./balances-cache"
import { currencyConfig } from "./currency"

const nativeToken = (networkId: string, coingeckoId?: string) => ({
	id: `${networkId}:substrate-native`,
	platform: "polkadot" as const,
	networkId,
	type: "substrate-native" as const,
	symbol: "TST",
	decimals: 10,
	name: "Test",
	existentialDeposit: "1",
	...(coingeckoId === undefined ? {} : { coingeckoId }),
})

const chaindata: ChaindataFile = {
	networks: [],
	tokens: [
		nativeToken("priced", "portal-coin"),
		nativeToken("unpriced"),
		nativeToken("unlisted", "coin-unknown-to-coins"),
	],
	miniMetadatas: [],
}

const prices: CoinsApiPrices = {
	"portal-coin": { usd: 2.5, eur: 2, dot: 0.5 },
	talisman: { usd: 0.004, eur: 0.0035 },
}

const coinsCalls = (fetch: ReturnType<typeof vi.fn>) =>
	fetch.mock.calls.filter(([input]) => String(input) === COINS_API_URL)

const wrapper = ({ children }: { children: ReactNode }) => <Subscribe>{children}</Subscribe>

const load = async () => {
	vi.resetModules()
	return {
		rates: await import("./token-rates"),
		currency: await import("./currency"),
	}
}

describe("token prices", () => {
	let coins: (init: RequestInit | undefined) => Promise<Response>
	let fetch: ReturnType<typeof vi.fn>

	beforeEach(() => {
		localStorage.clear()
		coins = async (init) => coinsApiReply(init, prices)
		fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
			const url = String(input)
			if (url === `${location.origin}/chaindata.json`)
				return new Response(JSON.stringify(chaindata))
			if (url === COINS_API_URL) return await coins(init)
			return new Response(null, { status: 404 })
		})
		vi.stubGlobal("fetch", fetch)
	})

	afterEach(() => vi.unstubAllGlobals())

	it("prices a chaindata token in the selected currency and switches currency without another request", async () => {
		const { rates, currency } = await load()

		const { result } = renderHook(() => rates.useTokenPriceLoadable("priced:substrate-native"), {
			wrapper,
		})

		await vi.waitFor(() => expect(result.current).toEqual({ status: "success", data: 2.5 }))
		act(() => currency.setSelectedCurrency("eur"))
		expect(result.current).toEqual({ status: "success", data: 2 })
		act(() => currency.setSelectedCurrency("dot"))
		expect(result.current).toEqual({ status: "success", data: 0.5 })

		expect(coinsCalls(fetch)).toHaveLength(1)
		expect(coinsApiRequestOf(coinsCalls(fetch)[0]?.[1])).toEqual({
			coingeckoIds: ["coin-unknown-to-coins", "portal-coin", "talisman"],
			currencyIds: Object.keys(currencyConfig),
		})
	})

	it("prices SEEK, which the shipped chaindata lacks", async () => {
		const { rates } = await load()

		const { result } = renderHook(() => rates.useTokenPriceLoadable(SEEK_TOKEN_ID), { wrapper })

		await vi.waitFor(() => expect(result.current).toEqual({ status: "success", data: 0.004 }))
	})

	it.each([
		["a token without a coingecko id", "unpriced:substrate-native"],
		["a token the coins api has no rate for", "unlisted:substrate-native"],
		["a token missing from chaindata", "missing:substrate-native"],
	])("prices %s at 0 once the rates load", async (_, tokenId) => {
		const { rates } = await load()

		const { result } = renderHook(() => rates.useTokenPriceLoadable(tokenId), { wrapper })

		await vi.waitFor(() => expect(result.current).toEqual({ status: "success", data: 0 }))
	})

	it("prices a currency the coins api has no rate for at 0", async () => {
		const { rates, currency } = await load()
		currency.setSelectedCurrency("jpy")

		const { result } = renderHook(() => rates.useTokenPriceLoadable("priced:substrate-native"), {
			wrapper,
		})

		await vi.waitFor(() => expect(result.current).toEqual({ status: "success", data: 0 }))
	})

	it("stays loading until the rates arrive", async () => {
		let reply: () => void = () => {}
		coins = (init) =>
			new Promise((resolve) => {
				reply = () => resolve(coinsApiReply(init, prices))
			})
		const { rates } = await load()

		const { result } = renderHook(() => rates.useTokenPriceLoadable("priced:substrate-native"), {
			wrapper,
		})

		await vi.waitFor(() => expect(coinsCalls(fetch)).toHaveLength(1))
		expect(result.current).toEqual({ status: "loading" })
		act(() => reply())
		await vi.waitFor(() => expect(result.current).toEqual({ status: "success", data: 2.5 }))
	})

	it("prices from the cached rates while the first request is in flight", async () => {
		localStorage.setItem(
			BALANCES_CACHE_KEY,
			JSON.stringify({
				version: 1,
				balances: [],
				subtensorStakes: [],
				tokenRates: { "priced:substrate-native": { usd: { price: 3 } } },
			})
		)
		coins = () => new Promise(() => {})
		const { rates } = await load()

		const { result } = renderHook(() => rates.useTokenPriceLoadable("priced:substrate-native"), {
			wrapper,
		})

		await vi.waitFor(() => expect(result.current).toEqual({ status: "success", data: 3 }))
	})

	it("prices at 0 when the coins api cannot be reached", async () => {
		coins = async () => {
			throw new TypeError("Failed to fetch")
		}
		const { rates } = await load()

		const { result } = renderHook(() => rates.useTokenPriceLoadable("priced:substrate-native"), {
			wrapper,
		})

		await vi.waitFor(() => expect(result.current).toEqual({ status: "success", data: 0 }))
	})
})
