import type { IBalance } from "@talismn/balances"
import { ALL_CURRENCY_IDS, newTokenRates, type TokenRatesList } from "@talismn/token-rates"
import { encodeAnyAddress } from "@talismn/util"
import { z } from "zod"

import type { SubtensorStakesByAddress } from "./subtensor-stakes"

export const BALANCES_CACHE_KEY = "balances-cache"
const BALANCES_CACHE_VERSION = 1

export type BalancesCache = {
	balances: IBalance[]
	subtensorStakes: SubtensorStakesByAddress
	tokenRates: TokenRatesList
}

export const EMPTY_BALANCES_CACHE: BalancesCache = {
	balances: [],
	subtensorStakes: new Map(),
	tokenRates: {},
}

const AmountSchema = z.looseObject({
	type: z.enum(["free", "reserved", "locked", "extra", "nompool"]),
	source: z.string().optional(),
	label: z.string(),
	amount: z.string(),
})

const BalanceBaseSchema = {
	source: z.string(),
	status: z.enum(["live", "cache", "stale"]),
	address: z.string(),
	tokenId: z.string(),
	networkId: z.string(),
}

const BalanceSchema = z.union([
	z.looseObject({
		...BalanceBaseSchema,
		value: z.string(),
		values: z.array(AmountSchema).optional(),
	}),
	z.looseObject({
		...BalanceBaseSchema,
		values: z.array(AmountSchema),
		value: z.undefined().optional(),
	}),
])

const ExtraAmountSchema = z.looseObject({
	type: z.literal("extra"),
	source: z.string().optional(),
	label: z.string(),
	amount: z.string(),
	includeInTotal: z.boolean().optional(),
})

const TokenRatesSchema = z.partialRecord(
	z.enum(ALL_CURRENCY_IDS),
	z.looseObject({ price: z.number() }).nullable()
)

const StoredBalancesCacheSchema = z.object({
	version: z.literal(BALANCES_CACHE_VERSION),
	balances: z.array(BalanceSchema),
	subtensorStakes: z.array(z.tuple([z.string(), z.array(ExtraAmountSchema)])),
	tokenRates: z.record(z.string(), TokenRatesSchema.nullable()),
})

type StoredBalancesCache = z.infer<typeof StoredBalancesCacheSchema>

const fromStored = (stored: StoredBalancesCache): BalancesCache => ({
	balances: stored.balances,
	subtensorStakes: new Map(stored.subtensorStakes),
	tokenRates: Object.fromEntries(
		Object.entries(stored.tokenRates).flatMap(([tokenId, rates]) =>
			rates === null ? [] : [[tokenId, { ...newTokenRates(), ...rates }]]
		)
	),
})

const toStored = (cache: BalancesCache): StoredBalancesCache => ({
	version: BALANCES_CACHE_VERSION,
	balances: cache.balances,
	subtensorStakes: [...cache.subtensorStakes],
	tokenRates: cache.tokenRates,
})

export const readBalancesCache = (): BalancesCache => {
	try {
		const stored = StoredBalancesCacheSchema.safeParse(
			JSON.parse(localStorage.getItem(BALANCES_CACHE_KEY) ?? "null")
		)
		return stored.success ? fromStored(stored.data) : EMPTY_BALANCES_CACHE
	} catch {
		return EMPTY_BALANCES_CACHE
	}
}

export const writeBalancesCache = (cache: BalancesCache) =>
	localStorage.setItem(BALANCES_CACHE_KEY, JSON.stringify(toStored(cache)))

export const keepAddresses = (cache: BalancesCache, addresses: string[]): BalancesCache => {
	const kept = new Set(addresses.map((address) => encodeAnyAddress(address)))
	return {
		balances: cache.balances.filter(({ address }) => kept.has(encodeAnyAddress(address))),
		subtensorStakes: new Map(
			[...cache.subtensorStakes].filter(([address]) => kept.has(encodeAnyAddress(address)))
		),
		tokenRates: cache.tokenRates,
	}
}
