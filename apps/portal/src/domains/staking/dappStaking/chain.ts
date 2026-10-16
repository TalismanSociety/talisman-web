import type { SS58String } from "polkadot-api"
import {
	combineLatest,
	defer,
	distinctUntilChanged,
	filter,
	map,
	type Observable,
	of,
	shareReplay,
	switchMap,
} from "rxjs"

import { getPapiClient } from "@/domains/chains/papi-client"
import type { PortalRuntime, SmartContract } from "@/domains/chains/portal-runtime"
import { chainReadId$ } from "@/domains/common/chainReadId"

import {
	type AprInput,
	type DappStake,
	dappStakeOf,
	type EraLengths,
	expectedBlockTimeOf,
	lastStakedPeriodOf,
	type RewardPlan,
	rewardPlanOf,
	type StakerInfoEntry,
} from "./stake"

const BEST = { at: "best" } as const

export const dappStakingApi = (genesisHash: string) =>
	getPapiClient(genesisHash).getUnsafeApi<PortalRuntime>()

const valuesOf = <T>(source$: Observable<{ value: T }>) =>
	source$.pipe(
		map(({ value }) => value),
		distinctUntilChanged()
	)

export const protocolState$ = (genesisHash: string) =>
	defer(() =>
		valuesOf(dappStakingApi(genesisHash).query.DappStaking.ActiveProtocolState.watchValue(BEST))
	)

const ledger$ = (genesisHash: string, address: SS58String) =>
	defer(() =>
		valuesOf(dappStakingApi(genesisHash).query.DappStaking.Ledger.watchValue(address, BEST))
	)

export const ledgers$ = (genesisHash: string, addresses: SS58String[]) =>
	addresses.length === 0
		? of([])
		: combineLatest(addresses.map((address) => ledger$(genesisHash, address)))

export const account$ = (genesisHash: string, address: SS58String) =>
	defer(() => valuesOf(dappStakingApi(genesisHash).query.System.Account.watchValue(address, BEST)))

export const stakerInfo$ = (genesisHash: string, address: SS58String, contract: SmartContract) =>
	defer(() =>
		valuesOf(
			dappStakingApi(genesisHash).query.DappStaking.StakerInfo.watchValue(address, contract, BEST)
		)
	)

const bestNumber$ = (genesisHash: string) =>
	defer(() => getPapiClient(genesisHash).bestBlocks$).pipe(
		map((blocks) => blocks[0]?.number),
		filter((number) => number !== undefined),
		distinctUntilChanged()
	)

const stakerInfos$ = (genesisHash: string, address: SS58String) =>
	chainReadId$.pipe(
		switchMap(
			(): Promise<StakerInfoEntry[]> =>
				dappStakingApi(genesisHash).query.DappStaking.StakerInfo.getEntries(address, BEST)
		)
	)

const rewardSpans$ = (genesisHash: string, address: SS58String) =>
	defer(() => {
		const api = dappStakingApi(genesisHash)
		return combineLatest([
			protocolState$(genesisHash),
			ledger$(genesisHash, address),
			api.constants.DappStaking.EraRewardSpanLength(),
			api.constants.DappStaking.RewardRetentionInPeriods(),
		]).pipe(
			switchMap(async ([protocol, ledger, eraRewardSpanLength, rewardRetentionInPeriods]) => {
				const lastStakedPeriodEnd = await api.query.DappStaking.PeriodEnd.getValue(
					lastStakedPeriodOf(ledger),
					BEST
				)
				const plan: RewardPlan = rewardPlanOf(
					{ protocol, ledger, eraRewardSpanLength, rewardRetentionInPeriods },
					lastStakedPeriodEnd?.final_era
				)
				const spans = await api.query.DappStaking.EraRewards.getValues(
					plan.spanIndexes.map((index) => [index]),
					BEST
				)
				return { protocol, ledger, plan, spans }
			})
		)
	})

export const dappStake$ = (genesisHash: string, address: SS58String): Observable<DappStake> =>
	combineLatest([
		rewardSpans$(genesisHash, address),
		stakerInfos$(genesisHash, address),
		bestNumber$(genesisHash),
		expectedBlockTime$(genesisHash),
	]).pipe(
		map(([rewards, stakerInfos, bestNumber, blockTime]) =>
			dappStakeOf({ ...rewards, stakerInfos, bestNumber, blockTime })
		)
	)

const eraLengthsByGenesisHash = new Map<string, Observable<EraLengths>>()

const eraLengths$ = (genesisHash: string) => {
	const cached = eraLengthsByGenesisHash.get(genesisHash)
	if (cached) return cached
	const eraLengths = defer(async (): Promise<EraLengths> => {
		const { DappStakingApi } = dappStakingApi(genesisHash).apis
		const [buildAndEarn, voting, eraLength, periodsPerCycle] = await Promise.all([
			DappStakingApi.eras_per_build_and_earn_subperiod(),
			DappStakingApi.eras_per_voting_subperiod(),
			DappStakingApi.blocks_per_era(),
			DappStakingApi.periods_per_cycle(),
		])
		return {
			standardErasPerBuildAndEarnPeriod: buildAndEarn,
			standardErasPerVotingPeriod: voting,
			standardEraLength: eraLength,
			periodsPerCycle,
		}
	}).pipe(shareReplay(1))
	eraLengthsByGenesisHash.set(genesisHash, eraLengths)
	return eraLengths
}

export const aprInput$ = (genesisHash: string): Observable<AprInput> =>
	defer(() => {
		const { query } = dappStakingApi(genesisHash)
		return combineLatest({
			eraLengths: eraLengths$(genesisHash),
			protocol: protocolState$(genesisHash),
			currentEraInfo: valuesOf(query.DappStaking.CurrentEraInfo.watchValue(BEST)),
			totalIssuance: valuesOf(query.Balances.TotalIssuance.watchValue(BEST)),
			inflationParams: valuesOf(query.Inflation.InflationParams.watchValue(BEST)),
			activeInflationConfig: valuesOf(query.Inflation.ActiveInflationConfig.watchValue(BEST)),
		})
	})

const expectedBlockTime$ = (genesisHash: string) =>
	defer(() => dappStakingApi(genesisHash).constants.Timestamp.MinimumPeriod()).pipe(
		map(expectedBlockTimeOf)
	)

export const unlockDuration$ = (genesisHash: string) =>
	defer(() =>
		combineLatest([
			dappStakingApi(genesisHash).constants.DappStaking.UnlockingPeriod(),
			eraLengths$(genesisHash),
			expectedBlockTime$(genesisHash),
		])
	).pipe(
		map(
			([unlockingPeriod, { standardEraLength }, blockTime]) =>
				unlockingPeriod * standardEraLength * blockTime
		)
	)

export const minimumStakeAmount$ = (genesisHash: string) =>
	defer(() => dappStakingApi(genesisHash).constants.DappStaking.MinimumStakeAmount())

export const contractStakes$ = (genesisHash: string, contracts: SmartContract[]) =>
	defer(async () => {
		const { query } = dappStakingApi(genesisHash)
		const dappInfos = await query.DappStaking.IntegratedDApps.getValues(
			contracts.map((contract) => [contract]),
			BEST
		)
		return query.DappStaking.ContractStake.getValues(
			dappInfos.map((info) => [info?.id ?? 0]),
			BEST
		)
	})
