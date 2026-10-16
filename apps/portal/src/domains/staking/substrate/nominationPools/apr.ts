import BigNumber from "bignumber.js"
import { hoursToMilliseconds } from "date-fns"
import range from "lodash/range"
import { combineLatest, from, map, type Observable, switchMap } from "rxjs"

import type { ChainRuntime } from "@/domains/chains/chain-runtime"

import {
	eraRewards,
	eraTotalStake,
	eraTotalStakes,
	type Runtimes,
	watchActiveEra,
	watchTotalIssuance,
} from "./chain"
import { expectedEraTimeMs, historyDepth, stakingErasPerYear } from "./era-timing"

const MAX_ASSET_HUB_ERAS_TO_CHECK = 15

export const assetHubApr = (eraRewards: bigint[], eraStakes: bigint[], erasPerYear: number) => {
	const totalRewards = eraRewards.reduce((total, reward) => total + reward, 0n)
	const totalStakes = eraStakes.reduce((total, stake) => total + stake, 0n)
	if (totalStakes === 0n || totalRewards === 0n) return 0
	const ratioDigits = 10_000n
	return (
		Number((ratioDigits * BigInt(erasPerYear) * totalRewards) / totalStakes) / Number(ratioDigits)
	)
}

export const inflationApr = (
	rewards: bigint[],
	lastEraTotalStaked: bigint,
	totalIssuance: bigint,
	erasPerDay: number
) => {
	const averageValidatorReward = rewards
		.reduce((total, reward) => total.plus(reward.toString()), new BigNumber(0))
		.dividedBy(rewards.length)
	const supplyStaked =
		lastEraTotalStaked === 0n || totalIssuance === 0n
			? 0
			: new BigNumber(lastEraTotalStaked.toString()).div(totalIssuance.toString())
	const averageRewardPerDay = averageValidatorReward.multipliedBy(erasPerDay)
	const dayRewardRate = averageRewardPerDay.dividedBy(new BigNumber(totalIssuance.toString()))
	const inflationToStakers = dayRewardRate.multipliedBy(365)
	return inflationToStakers.dividedBy(supplyStaked).toNumber() || 0
}

const assetHubApr$ = ({ runtime, babeRuntime }: Runtimes, activeEra: number) => {
	const maxEras = Math.min(MAX_ASSET_HUB_ERAS_TO_CHECK, historyDepth(runtime.lookup))
	const eras = range(activeEra - maxEras, activeEra - 1).filter((era) => era >= 0)
	return combineLatest([eraRewards(runtime, eras), eraTotalStakes(runtime, eras)]).pipe(
		map(([rewards, stakes]) =>
			assetHubApr(rewards, stakes, stakingErasPerYear(babeRuntime.lookup, runtime.lookup))
		)
	)
}

const inflationApr$ = (runtime: ChainRuntime, activeEra: number) => {
	const eraTime = expectedEraTimeMs(runtime.lookup)
	const erasPerDay = hoursToMilliseconds(24) / eraTime
	const depth = historyDepth(runtime.lookup)
	const daysToCheck = Math.round(depth / erasPerDay) >= 30 ? 30 : 15
	const erasToCheck = Math.round(hoursToMilliseconds(daysToCheck * 24) / eraTime)
	const eras = range(Math.max(activeEra - erasToCheck, Math.max(0, activeEra - depth)), activeEra)
	const lastEra = activeEra === 0 ? 0 : activeEra - 1
	return combineLatest([
		eraRewards(runtime, eras),
		eraTotalStake(runtime, lastEra),
		watchTotalIssuance(runtime),
	]).pipe(
		map(([rewards, lastEraTotalStaked, totalIssuance]) =>
			inflationApr(rewards, lastEraTotalStaked, totalIssuance, erasPerDay)
		)
	)
}

const ANALOG_APY_URL = "https://explorer-api.analog.one/api/nominations?projection=apy"

const analogApr = async () => {
	try {
		const result = await (await fetch(ANALOG_APY_URL)).json()
		if (result?.status !== 200) {
			console.warn("Failed to fetch analog apy (non-200 status)", result)
			return 0
		}
		const apy = result?.data?.apy
		if (typeof apy !== "number") {
			console.warn("Failed to fetch analog apy (apy is not number)", result)
			return 0
		}
		return apy / 100
	} catch (cause) {
		console.warn("Failed to fetch analog apy (fetch error)", cause)
		return 0
	}
}

export type AprSource = "analog" | "asset-hub" | "inflation"

export const apr$ = (runtimes: Runtimes, source: AprSource): Observable<number> => {
	if (source === "analog") return from(analogApr())
	return watchActiveEra(runtimes.runtime).pipe(
		switchMap((activeEra) => {
			const era = activeEra?.index ?? 0
			return source === "asset-hub"
				? assetHubApr$(runtimes, era)
				: inflationApr$(runtimes.runtime, era)
		})
	)
}

export const aprSourceOf = (chainId: string): AprSource =>
	chainId === "analog-timechain"
		? "analog"
		: chainId === "kusama-asset-hub" || chainId === "polkadot-asset-hub"
			? "asset-hub"
			: "inflation"
