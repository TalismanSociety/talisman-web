import { newTokenRates } from "@talismn/token-rates"
import { beforeEach, describe, expect, it } from "vitest"

import {
	BALANCES_CACHE_KEY,
	type BalancesCache,
	EMPTY_BALANCES_CACHE,
	readBalancesCache,
	writeBalancesCache,
} from "./balances-cache"

const GUARDIAN = "5CcU6DRpocLUWYJHuNLjB4gGyHJrkWuruQD5XFbRYffCfSAP"
const OTHER = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"

const taoStake = {
	type: "extra" as const,
	label: "subtensor-staking",
	amount: "249999999",
	includeInTotal: true,
	meta: { netuid: 0, hotkey: OTHER, amountStaked: "249999999" },
}

const cache: BalancesCache = {
	balances: [
		{
			source: "substrate-native",
			status: "cache",
			address: GUARDIAN,
			tokenId: "bittensor:substrate-native",
			networkId: "bittensor",
			values: [
				{ type: "free", label: "free", amount: "1745553845" },
				{ type: "locked", label: "fees", amount: "0", meta: { id: "fees" } },
			],
		},
		{
			source: "evm-native",
			status: "cache",
			address: "0x5e0E6B6eD8e9b5E3aB8C7c6A3e0d2C1b0A9f8E7D",
			tokenId: "1:evm-native",
			networkId: "1",
			value: "3000000000000000",
		},
	],
	subtensorStakes: new Map([[GUARDIAN, [taoStake]]]),
	tokenRates: {
		"bittensor:substrate-native": {
			...newTokenRates(),
			usd: { price: 277.99, marketCap: 3152297329, change24h: 2.54 },
			eur: null,
		},
	},
}

describe("balances cache", () => {
	beforeEach(() => localStorage.clear())

	it("reads back what it wrote", () => {
		writeBalancesCache(cache)

		expect(readBalancesCache()).toEqual(cache)
	})

	it("is empty when nothing was written", () => {
		expect(readBalancesCache()).toEqual(EMPTY_BALANCES_CACHE)
	})

	it("ignores a value that is not JSON", () => {
		localStorage.setItem(BALANCES_CACHE_KEY, "120,156,205,88")

		expect(readBalancesCache()).toEqual(EMPTY_BALANCES_CACHE)
	})

	it("ignores a value from another format version", () => {
		localStorage.setItem(
			BALANCES_CACHE_KEY,
			JSON.stringify({ version: 2, balances: [], subtensorStakes: [], tokenRates: {} })
		)

		expect(readBalancesCache()).toEqual(EMPTY_BALANCES_CACHE)
	})

	it("reads rates the coins API leaves partly empty", () => {
		localStorage.setItem(
			BALANCES_CACHE_KEY,
			JSON.stringify({
				version: 1,
				balances: [],
				subtensorStakes: [],
				tokenRates: {
					"vara:substrate-native": {
						usd: { price: 0.0000203, marketCap: 183854, change24h: null },
					},
					"westend-testnet:substrate-native": null,
				},
			})
		)

		expect(readBalancesCache().tokenRates).toEqual({
			"vara:substrate-native": {
				...newTokenRates(),
				usd: { price: 0.0000203, marketCap: 183854, change24h: null },
			},
		})
	})

	it("ignores a value whose balances are malformed", () => {
		localStorage.setItem(
			BALANCES_CACHE_KEY,
			JSON.stringify({
				version: 1,
				balances: [{ tokenId: 1, address: GUARDIAN }],
				subtensorStakes: [],
				tokenRates: {},
			})
		)

		expect(readBalancesCache()).toEqual(EMPTY_BALANCES_CACHE)
	})
})
