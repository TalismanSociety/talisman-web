import { AccountId, getSs58AddressInfo } from "@polkadot-api/substrate-bindings"
import type { SS58String } from "polkadot-api"
import { from, map, type Observable, of } from "rxjs"

import { type ChainRuntime, hasStorage } from "@/domains/chains/chain-runtime"
import type { SlashingSpansValue } from "@/domains/chains/portal-runtime"
import { ss58PrefixOf } from "../nominationPools/chain"

import { type EraInputs, type ExposurePage, eraExposureOf, type ValidatorExposure } from "./rewards"

const BEST = { at: "best" } as const

const valueOf = <T>(source$: Observable<{ value: T }>) => source$.pipe(map(({ value }) => value))

const GENERIC_SS58_PREFIX = 42

export const chainAddressOf = (prefix: number, address: string) =>
	AccountId(prefix).dec(AccountId().enc(address))

export const chainAddressFor = (runtime: ChainRuntime, address: string) =>
	chainAddressOf(ss58PrefixOf(runtime) ?? GENERIC_SS58_PREFIX, address)

export const inFormatOf = (reference: string, address: string) => {
	const info = getSs58AddressInfo(reference)
	return chainAddressOf(info.isValid ? info.ss58Format : GENERIC_SS58_PREFIX, address)
}

export const spanCountOf = (spans: SlashingSpansValue | undefined) => (spans?.prior.length ?? 0) + 1

export const withdrawSpanCount = ({ api, lookup }: ChainRuntime, stash: SS58String) =>
	hasStorage(lookup, "Staking", "SlashingSpans")
		? from(api.query.Staking.SlashingSpans.getValue(stash, BEST)).pipe(map(spanCountOf))
		: of(0)

export const watchController = ({ api }: ChainRuntime, stash: SS58String) =>
	valueOf(api.query.Staking.Bonded.watchValue(stash, BEST))

export const watchLedger = ({ api }: ChainRuntime, controller: SS58String) =>
	valueOf(api.query.Staking.Ledger.watchValue(controller, BEST))

export const watchCurrentEra = ({ api }: ChainRuntime) =>
	valueOf(api.query.Staking.CurrentEra.watchValue(BEST))

export const watchMinNominatorBond = ({ api }: ChainRuntime) =>
	valueOf(api.query.Staking.MinNominatorBond.watchValue(BEST))

const UNPAID_ERA: Omit<EraInputs, "era"> = {
	exposure: eraExposureOf([], []),
	eraPoints: 0n,
	validatorPoints: new Map(),
	commissions: new Map(),
	eraReward: 0n,
}

export const eraInputs = async ({ api }: ChainRuntime, era: number): Promise<EraInputs> => {
	const reward = await api.query.Staking.ErasValidatorReward.getValue(era, BEST)
	if (reward === undefined) return { era, ...UNPAID_ERA }
	const [overview, paged, points, prefs] = await Promise.all([
		api.query.Staking.ErasStakersOverview.getEntries(era, BEST),
		api.query.Staking.ErasStakersPaged.getEntries(era, BEST),
		api.query.Staking.ErasRewardPoints.getValue(era, BEST),
		api.query.Staking.ErasValidatorPrefs.getEntries(era, BEST),
	])
	return {
		era,
		exposure: eraExposureOf(
			overview.map(
				({ keyArgs: [, validator], value }) =>
					[validator, { total: value.total, own: value.own }] as [SS58String, ValidatorExposure]
			),
			paged.map(
				({ keyArgs: [, validator], value }) =>
					[validator, { others: value.others }] as [SS58String, ExposurePage]
			)
		),
		eraPoints: BigInt(points.total),
		validatorPoints: new Map(
			points.individual.map(([validator, value]) => [validator, BigInt(value)])
		),
		commissions: new Map(
			prefs.map(({ keyArgs: [, validator], value }) => [validator, BigInt(value.commission)])
		),
		eraReward: reward,
	}
}
