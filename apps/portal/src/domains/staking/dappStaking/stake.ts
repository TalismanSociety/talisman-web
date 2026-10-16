import BigNumber from "bignumber.js"
import { range } from "lodash"
import type { SizedHex, SS58String } from "polkadot-api"

import type {
	AccountLedger,
	EraInfo,
	EraRewardSpan,
	InflationConfiguration,
	InflationParameters,
	ProtocolState,
	SingularStakingInfo,
	SmartContract,
	StakeAmount,
} from "@/domains/chains/portal-runtime"

export const smartContractOf = (address: string): SmartContract =>
	address.startsWith("0x")
		? { type: "Evm", value: address as SizedHex<20> }
		: { type: "Wasm", value: address }

const ZERO_STAKE: StakeAmount = { voting: 0n, build_and_earn: 0n, era: 0, period: 0 }

const totalOf = (amount: StakeAmount) => amount.voting + amount.build_and_earn

export const stakeInPeriod = (
	stake: { staked: StakeAmount; staked_future: StakeAmount | undefined },
	period: number
) => {
	const amount = [stake.staked_future ?? ZERO_STAKE, stake.staked].find((x) => x.period === period)
	return amount === undefined ? undefined : totalOf(amount)
}

export type StakerInfoEntry = {
	keyArgs: [SS58String, SmartContract]
	value: SingularStakingInfo
}

export type RewardPlanInput = {
	protocol: ProtocolState
	ledger: AccountLedger
	eraRewardSpanLength: number
	rewardRetentionInPeriods: number
}

export const lastStakedPeriodOf = (ledger: AccountLedger) =>
	Math.max(ledger.staked.period, (ledger.staked_future ?? ZERO_STAKE).period)

export type RewardPlan = { spanIndexes: number[]; claimableSpanCount: number }

const firstStakedEraOf = (ledger: AccountLedger) => {
	const stakedEra = ledger.staked.era === 0 ? undefined : ledger.staked.era
	const stakedFutureEra = ledger.staked_future?.era
	if (stakedEra === undefined) return stakedFutureEra
	if (stakedFutureEra === undefined) return stakedEra
	return Math.min(stakedEra, stakedFutureEra)
}

export const rewardPlanOf = (
	{ protocol, ledger, eraRewardSpanLength, rewardRetentionInPeriods }: RewardPlanInput,
	lastStakedPeriodFinalEra: number | undefined
): RewardPlan => {
	const currentPeriod = protocol.period_info.number
	const lastStakedPeriod = lastStakedPeriodOf(ledger)
	const lastStakedEra =
		lastStakedPeriod === currentPeriod ? protocol.era - 1 : (lastStakedPeriodFinalEra ?? 0)
	const rewardsExpired = lastStakedPeriod <= currentPeriod - rewardRetentionInPeriods
	const firstStakedEra = firstStakedEraOf(ledger)

	if (rewardsExpired || firstStakedEra === undefined)
		return { spanIndexes: [], claimableSpanCount: 0 }

	const firstSpanIndex = firstStakedEra - (firstStakedEra % eraRewardSpanLength)
	const lastSpanIndex = lastStakedEra - (lastStakedEra % eraRewardSpanLength)

	return {
		spanIndexes: range(firstSpanIndex, lastSpanIndex + 1).filter(
			(index) => index % eraRewardSpanLength === 0
		),
		claimableSpanCount: (lastSpanIndex - firstSpanIndex) / eraRewardSpanLength + 1,
	}
}

const stakeEligibleInEra = (ledger: AccountLedger, era: number) => {
	const stakedEra = ledger.staked.era
	const stakedFuture = ledger.staked_future
	if (stakedFuture === undefined) return stakedEra <= era ? totalOf(ledger.staked) : 0n
	if (stakedFuture.era <= era) return totalOf(stakedFuture)
	return stakedEra <= era ? totalOf(ledger.staked) : 0n
}

export const stakerRewardsOf = (ledger: AccountLedger, spans: Array<EraRewardSpan | undefined>) =>
	spans
		.filter((span): span is EraRewardSpan => span !== undefined)
		.map((span) =>
			range(span.first_era, span.last_era + 1)
				.map((era) => {
					const eraSpan = span.span[era - span.first_era]
					return eraSpan === undefined || eraSpan.staked === 0n
						? 0n
						: BigInt(
								new BigNumber(eraSpan.staker_reward_pool.toString())
									.times(stakeEligibleInEra(ledger, era).toString())
									.div(eraSpan.staked.toString())
									.integerValue()
									.toString()
							)
				})
				.reduce((prev, curr) => prev + curr, 0n)
		)
		.reduce((prev, curr) => prev + curr, 0n)

export type DappStakeInput = {
	protocol: ProtocolState
	ledger: AccountLedger
	stakerInfos: StakerInfoEntry[]
	plan: RewardPlan
	spans: Array<EraRewardSpan | undefined>
	bestNumber: number
	blockTime: number
}

export const dappStakeOf = ({
	protocol,
	ledger,
	stakerInfos,
	plan,
	spans,
	bestNumber,
	blockTime,
}: DappStakeInput) => {
	const totalStaked = stakeInPeriod(ledger, protocol.period_info.number)
	const locked = ledger.locked - (totalStaked ?? 0n)
	const pending = ledger.unlocking.filter((chunk) => chunk.unlock_block > bestNumber)
	const dapps = stakerInfos
		.map(({ keyArgs, value }) => [keyArgs[1], value] as const)
		.filter(([, info]) => info.staked.period === protocol.period_info.number)

	return {
		ledger,
		totalStaked,
		locked,
		stakerRewards: stakerRewardsOf(ledger, spans),
		claimableSpanCount: plan.claimableSpanCount,
		pendingUnlocks: pending.map((chunk) => ({
			amount: chunk.amount,
			remainingMs: (chunk.unlock_block - bestNumber) * blockTime,
		})),
		totalUnlocking: pending.reduce((prev, curr) => prev + curr.amount, 0n),
		withdrawable: ledger.unlocking
			.filter((chunk) => chunk.unlock_block <= bestNumber)
			.reduce((prev, curr) => prev + curr.amount, 0n),
		dapps,
		active: dapps.length > 0 || ledger.unlocking.length > 0 || locked > 0n,
		earningRewards: totalStaked !== undefined && totalStaked > 0n,
	}
}

export type DappStake = ReturnType<typeof dappStakeOf>

export type EraLengths = {
	standardErasPerBuildAndEarnPeriod: number
	standardErasPerVotingPeriod: number
	standardEraLength: number
	periodsPerCycle: number
}

export type AprInput = {
	eraLengths: EraLengths
	protocol: ProtocolState
	currentEraInfo: EraInfo
	totalIssuance: bigint
	inflationParams: InflationParameters
	activeInflationConfig: InflationConfiguration
}

const perquintillToNumber = (value: bigint) =>
	new BigNumber(value.toString()).times(0.0000000000000001).times(0.01).toNumber()

export const aprOf = ({
	eraLengths,
	protocol,
	currentEraInfo,
	totalIssuance,
	inflationParams,
	activeInflationConfig,
}: AprInput) => {
	const secBlockProductionRate = 12
	const secsOneYear = 365 * 24 * 60 * 60
	const periodLength =
		eraLengths.standardErasPerBuildAndEarnPeriod + eraLengths.standardErasPerVotingPeriod
	const eraPerCycle = periodLength * eraLengths.periodsPerCycle
	const blockPerCycle = eraLengths.standardEraLength * eraPerCycle
	const cyclesPerYear = secsOneYear / secBlockProductionRate / blockPerCycle

	const yearlyInflation = perquintillToNumber(inflationParams.max_inflation_rate)
	const baseStakersPart = perquintillToNumber(inflationParams.base_stakers_part)
	const adjustableStakersPart = perquintillToNumber(inflationParams.adjustable_stakers_part)
	const idealStakingRate = perquintillToNumber(inflationParams.ideal_staking_rate)

	const voting = protocol.period_info.subperiod.type === "Voting"
	const currentStakeAmount = voting
		? currentEraInfo.next_stake_amount.voting
		: currentEraInfo.current_stake_amount.voting +
			currentEraInfo.current_stake_amount.build_and_earn

	const stakedPercent = new BigNumber(currentStakeAmount.toString())
		.div(totalIssuance.toString())
		.toNumber()
	const stakerRewardPercent =
		baseStakersPart + adjustableStakersPart * Math.min(1, stakedPercent / idealStakingRate)
	const rawStakerApr = ((yearlyInflation * stakerRewardPercent) / stakedPercent) * cyclesPerYear
	const stakerApr = Number.isFinite(rawStakerApr) ? rawStakerApr : 0

	const simulatedVoteAmount = 1000
	const voteAmount = voting
		? currentEraInfo.next_stake_amount.voting
		: currentEraInfo.current_stake_amount.voting
	const bonusPercentPerPeriod = new BigNumber(
		activeInflationConfig.bonus_reward_pool_per_period.toString()
	)
		.div(voteAmount.toString())
		.toNumber()
	const simulatedBonusPerPeriod = simulatedVoteAmount * bonusPercentPerPeriod
	const periodsPerYear = eraLengths.periodsPerCycle * cyclesPerYear
	const simulatedBonusAmountPerYear = simulatedBonusPerPeriod * periodsPerYear
	const rawBonusApr = simulatedBonusAmountPerYear / simulatedVoteAmount
	const bonusApr = Number.isFinite(rawBonusApr) ? rawBonusApr : 0

	return { stakerApr, bonusApr, totalApr: stakerApr + bonusApr }
}

const MINIMUM_VALID_PERIOD = 500n
const PARACHAIN_BLOCK_TIME = 12_000

export const expectedBlockTimeOf = (minimumPeriod: bigint) =>
	minimumPeriod >= MINIMUM_VALID_PERIOD ? Number(minimumPeriod * 2n) : PARACHAIN_BLOCK_TIME

export const stakePercentageOf = (staked: bigint, free: bigint) =>
	staked === 0n ? 0 : new BigNumber(staked.toString()).div(free.toString()).toNumber()
