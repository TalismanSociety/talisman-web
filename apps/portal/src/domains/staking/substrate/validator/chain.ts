import { AccountId } from "@polkadot-api/substrate-bindings"
import type { SS58String } from "polkadot-api"
import { from, map, type Observable, of } from "rxjs"

import { type ChainRuntime, hasStorage } from "@/domains/chains/chain-runtime"
import type { SlashingSpansValue, StakingLedgerValue } from "@/domains/chains/portal-runtime"

import { type EraInputs, type ExposurePage, eraExposureOf, type StakerInputs } from "./rewards"

const BEST = { at: "best" } as const

const valueOf = <T>(source$: Observable<{ value: T }>) => source$.pipe(map(({ value }) => value))

const GENERIC_SS58_PREFIX = 42

export const chainAddressOf = (prefix: number, address: string) =>
	AccountId(prefix).dec(AccountId().enc(address))

export const genericAddressOf = (address: string) => chainAddressOf(GENERIC_SS58_PREFIX, address)

export const spanCountOf = (spans: SlashingSpansValue | undefined) => (spans?.prior.length ?? 0) + 1

export const withdrawSlashingSpans = ({ api, lookup }: ChainRuntime, stash: SS58String) =>
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

const claimedErasOf = (ledger: StakingLedgerValue | undefined) =>
	ledger?.legacy_claimed_rewards ?? ledger?.claimed_rewards ?? []

const ledgersOf = async ({ api }: ChainRuntime, stashes: SS58String[]) => {
	const controllers = await api.query.Staking.Bonded.getValues(
		stashes.map((stash) => [stash] as [SS58String]),
		BEST
	)
	const bonded = controllers.flatMap((controller, index) =>
		controller === undefined ? [] : [{ stash: stashes[index]!, controller }]
	)
	const ledgers = await api.query.Staking.Ledger.getValues(
		bonded.map(({ controller }) => [controller] as [SS58String]),
		BEST
	)
	return new Map(bonded.map(({ stash }, index) => [stash, ledgers[index]]))
}

export const eraInputs = async ({ api }: ChainRuntime, era: number): Promise<EraInputs> => {
	const [paged, points, prefs, reward] = await Promise.all([
		api.query.Staking.ErasStakersPaged.getEntries(era, BEST),
		api.query.Staking.ErasRewardPoints.getValue(era, BEST),
		api.query.Staking.ErasValidatorPrefs.getEntries(era, BEST),
		api.query.Staking.ErasValidatorReward.getValue(era, BEST),
	])
	return {
		era,
		exposure: eraExposureOf(
			paged.map(
				({ keyArgs: [, validator], value }) =>
					[validator, { pageTotal: value.page_total, others: value.others }] as [
						SS58String,
						ExposurePage,
					]
			)
		),
		eraPoints: BigInt(points.total),
		validatorPoints: new Map(
			points.individual.map(([validator, value]) => [validator, BigInt(value)])
		),
		commissions: new Map(
			prefs.map(({ keyArgs: [, validator], value }) => [validator, BigInt(value.commission)])
		),
		eraReward: reward ?? 0n,
	}
}

const claimedRewardsEras = async ({ api }: ChainRuntime, stash: SS58String, era: number) => {
	if (era < 0) return []
	const [pages, overview] = await Promise.all([
		api.query.Staking.ClaimedRewards.getValue(era, stash, BEST),
		api.query.Staking.ErasStakersOverview.getValue(era, stash, BEST),
	])
	return pages.length > 0 && pages.length === overview?.page_count ? [era] : []
}

export const stakerInputs = async (
	runtime: ChainRuntime,
	stashes: SS58String[],
	lastCompleteEra: number
): Promise<StakerInputs[]> => {
	const ledgers = await ledgersOf(runtime, stashes)
	return Promise.all(
		stashes.map(async (stash) => ({
			stash,
			claimedRewardsEras: await claimedRewardsEras(runtime, stash, lastCompleteEra),
			legacyClaimedRewards: claimedErasOf(ledgers.get(stash)),
		}))
	)
}

export const validatorLegacyClaimedRewards = async (
	runtime: ChainRuntime,
	validators: SS58String[]
) => {
	const ledgers = await ledgersOf(runtime, validators)
	return new Map(validators.map((validator) => [validator, claimedErasOf(ledgers.get(validator))]))
}
