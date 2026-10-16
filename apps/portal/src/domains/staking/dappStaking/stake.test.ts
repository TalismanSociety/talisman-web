import { describe, expect, it } from "vitest"

import type { AccountLedger, ProtocolState, StakeAmount } from "@/domains/chains/portal-runtime"

import {
	aprOf,
	dappStakeOf,
	expectedBlockTimeOf,
	rewardPlanOf,
	smartContractOf,
	stakeInPeriod,
	stakePercentageOf,
	stakerRewardsOf,
} from "./stake"

const ASTR = 10n ** 18n

const amount = (stake: Partial<StakeAmount>): StakeAmount => ({
	voting: 0n,
	build_and_earn: 0n,
	era: 0,
	period: 0,
	...stake,
})

const ledgerOf = (ledger: Partial<AccountLedger>): AccountLedger => ({
	locked: 0n,
	unlocking: [],
	staked: amount({}),
	staked_future: undefined,
	contract_stake_count: 0,
	...ledger,
})

const protocolOf = (era: number, period: number): ProtocolState => ({
	era,
	next_era_start: 0,
	period_info: {
		number: period,
		subperiod: { type: "BuildAndEarn", value: undefined },
		next_subperiod_start_era: era + 100,
	},
	maintenance: false,
})

const plan = (ledger: AccountLedger, protocol: ProtocolState, finalEra?: number) =>
	rewardPlanOf({ protocol, ledger, eraRewardSpanLength: 16, rewardRetentionInPeriods: 4 }, finalEra)

describe("smartContractOf", () => {
	it("reads 0x addresses as Evm contracts and the rest as Wasm", () => {
		expect(smartContractOf("0xAbC")).toEqual({ type: "Evm", value: "0xAbC" })
		expect(smartContractOf("ZdpeaiK28o6DzkdVJardFTZEJTAHKG3HgJn5ZPgsPh345Hg")).toEqual({
			type: "Wasm",
			value: "ZdpeaiK28o6DzkdVJardFTZEJTAHKG3HgJn5ZPgsPh345Hg",
		})
	})
})

describe("stakeInPeriod", () => {
	it("prefers the future stake of the period and is undefined outside it", () => {
		const ledger = {
			staked: amount({ voting: 1n, build_and_earn: 2n, period: 7 }),
			staked_future: amount({ voting: 10n, build_and_earn: 20n, period: 7 }),
		}
		expect(stakeInPeriod(ledger, 7)).toBe(30n)
		expect(stakeInPeriod({ ...ledger, staked_future: undefined }, 7)).toBe(3n)
		expect(stakeInPeriod(ledger, 6)).toBeUndefined()
	})
})

describe("rewardPlanOf", () => {
	it("claims every span from the first staked era to the previous era of the current period", () => {
		const ledger = ledgerOf({ staked: amount({ era: 1470, period: 7, voting: ASTR }) })
		expect(plan(ledger, protocolOf(1493, 7))).toEqual({
			spanIndexes: [1456, 1472, 1488],
			claimableSpanCount: 3,
		})
	})

	it("ends a past period at its final era", () => {
		const ledger = ledgerOf({ staked: amount({ era: 1300, period: 5, voting: ASTR }) })
		expect(plan(ledger, protocolOf(1493, 7), 1340)).toEqual({
			spanIndexes: [1296, 1312, 1328],
			claimableSpanCount: 3,
		})
	})

	it("starts at the earlier of the staked and future eras", () => {
		const ledger = ledgerOf({
			staked: amount({ era: 1490, period: 7, voting: ASTR }),
			staked_future: amount({ era: 1480, period: 7, voting: ASTR }),
		})
		expect(plan(ledger, protocolOf(1493, 7)).spanIndexes).toEqual([1472, 1488])
	})

	it("claims nothing once rewards expired or without any stake", () => {
		const expired = ledgerOf({ staked: amount({ era: 867, period: 2, voting: ASTR }) })
		expect(plan(expired, protocolOf(1493, 7), 900)).toEqual({
			spanIndexes: [],
			claimableSpanCount: 0,
		})
		expect(plan(ledgerOf({}), protocolOf(1493, 7))).toEqual({
			spanIndexes: [],
			claimableSpanCount: 0,
		})
	})

	it("keeps main's descending span range when the past period end is unknown", () => {
		const ledger = ledgerOf({ staked: amount({ era: 1300, period: 5, voting: ASTR }) })
		expect(plan(ledger, protocolOf(1493, 7))).toEqual({
			spanIndexes: [
				1296, 1280, 1264, 1248, 1232, 1216, 1200, 1184, 1168, 1152, 1136, 1120, 1104, 1088, 1072,
				1056, 1040, 1024, 1008, 992, 976, 960, 944, 928, 912, 896, 880, 864, 848, 832, 816, 800,
				784, 768, 752, 736, 720, 704, 688, 672, 656, 640, 624, 608, 592, 576, 560, 544, 528, 512,
				496, 480, 464, 448, 432, 416, 400, 384, 368, 352, 336, 320, 304, 288, 272, 256, 240, 224,
				208, 192, 176, 160, 144, 128, 112, 96, 80, 64, 48, 32, 16,
			],
			claimableSpanCount: -80,
		})
	})
})

describe("stakerRewardsOf", () => {
	const span = (firstEra: number, eras: Array<[bigint, bigint]>) => ({
		first_era: firstEra,
		last_era: firstEra + eras.length - 1,
		span: eras.map(([pool, staked]) => ({
			staker_reward_pool: pool,
			staked,
			dapp_reward_pool: 0n,
		})),
	})

	it("pays the staked share of each era pool from the era the stake counts", () => {
		const ledger = ledgerOf({ staked: amount({ era: 101, period: 7, build_and_earn: 10n }) })
		const spans = [
			span(100, [
				[1000n, 100n],
				[1000n, 100n],
				[999n, 30n],
			]),
			undefined,
		]
		expect(stakerRewardsOf(ledger, spans)).toBe(100n + 333n)
	})

	it("switches to the future stake from its era and skips empty eras", () => {
		const ledger = ledgerOf({
			staked: amount({ era: 100, period: 7, voting: 10n }),
			staked_future: amount({ era: 102, period: 7, voting: 40n }),
		})
		const spans = [
			span(100, [
				[1000n, 100n],
				[1000n, 0n],
				[1000n, 100n],
			]),
		]
		expect(stakerRewardsOf(ledger, spans)).toBe(100n + 400n)
	})

	it("rounds each era share half up like bignumber.js", () => {
		const ledger = ledgerOf({ staked: amount({ era: 1, period: 7, voting: 1n }) })
		expect(stakerRewardsOf(ledger, [span(1, [[5n, 2n]])])).toBe(3n)
	})
})

describe("dappStakeOf", () => {
	it("splits locked, staked, pending and withdrawable funds", () => {
		const ledger = ledgerOf({
			locked: 1500n * ASTR,
			staked: amount({ era: 1490, period: 7, voting: 500n * ASTR }),
			unlocking: [
				{ amount: 100n * ASTR, unlock_block: 1_000 },
				{ amount: 200n * ASTR, unlock_block: 1_010 },
			],
			contract_stake_count: 1,
		})
		const stake = dappStakeOf({
			protocol: protocolOf(1493, 7),
			ledger,
			stakerInfos: [
				{
					keyArgs: ["a", { type: "Wasm", value: "current" }],
					value: { previous_staked: amount({}), staked: amount({ period: 7 }), bonus_status: 0 },
				},
				{
					keyArgs: ["a", { type: "Wasm", value: "old" }],
					value: { previous_staked: amount({}), staked: amount({ period: 6 }), bonus_status: 0 },
				},
			],
			plan: { spanIndexes: [], claimableSpanCount: 2 },
			spans: [],
			bestNumber: 1_004,
			blockTime: 12_000,
		})
		expect(stake).toMatchObject({
			totalStaked: 500n * ASTR,
			locked: 1000n * ASTR,
			stakerRewards: 0n,
			claimableSpanCount: 2,
			pendingUnlocks: [{ amount: 200n * ASTR, remainingMs: 72_000 }],
			totalUnlocking: 200n * ASTR,
			withdrawable: 100n * ASTR,
			active: true,
			earningRewards: true,
		})
		expect(stake.dapps.map(([contract]) => contract.value)).toEqual(["current"])
	})

	it("is inactive without dapps, unlocking chunks or free locked funds", () => {
		const stake = dappStakeOf({
			protocol: protocolOf(1493, 7),
			ledger: ledgerOf({}),
			stakerInfos: [],
			plan: { spanIndexes: [], claimableSpanCount: 0 },
			spans: [],
			bestNumber: 1,
			blockTime: 12_000,
		})
		expect(stake).toMatchObject({ totalStaked: undefined, active: false, earningRewards: false })
	})
})

describe("aprOf", () => {
	it("annualises the staker and bonus rewards of the cycle", () => {
		const apr = aprOf({
			eraLengths: {
				standardErasPerBuildAndEarnPeriod: 364,
				standardErasPerVotingPeriod: 1,
				standardEraLength: 14_400,
				periodsPerCycle: 1,
			},
			protocol: protocolOf(1493, 7),
			currentEraInfo: {
				total_locked: 0n,
				unlocking: 0n,
				current_stake_amount: amount({
					voting: 2_000_000_000n * ASTR,
					build_and_earn: 500_000_000n * ASTR,
				}),
				next_stake_amount: amount({ voting: 1n }),
			},
			totalIssuance: 8_000_000_000n * ASTR,
			inflationParams: {
				max_inflation_rate: 47_000_000_000_000_000n,
				treasury_part: 0n,
				collators_part: 0n,
				dapps_part: 0n,
				base_stakers_part: 100_000_000_000_000_000n,
				adjustable_stakers_part: 450_000_000_000_000_000n,
				bonus_part: 0n,
				ideal_staking_rate: 500_000_000_000_000_000n,
				decay_rate: 0n,
			},
			activeInflationConfig: {
				recalculation_era: 0,
				issuance_safety_cap: 0n,
				collator_reward_per_block: 0n,
				treasury_reward_per_block: 0n,
				dapp_reward_pool_per_era: 0n,
				base_staker_reward_pool_per_era: 0n,
				adjustable_staker_reward_pool_per_era: 0n,
				bonus_reward_pool_per_period: 6_000_000n * ASTR,
				ideal_staking_rate: 0n,
				decay_rate: 0n,
				decay_factor: 0n,
			},
		})
		const cyclesPerYear = (365 * 24 * 60 * 60) / 12 / (14_400 * 365)
		const stakedPercent = 0.3125
		const stakerApr =
			((0.047 * (0.1 + 0.45 * Math.min(1, stakedPercent / 0.5))) / stakedPercent) * cyclesPerYear
		const bonusApr = (1000 * (6_000_000 / 2_000_000_000) * cyclesPerYear) / 1000
		expect(apr.stakerApr).toBeCloseTo(stakerApr, 12)
		expect(apr.bonusApr).toBeCloseTo(bonusApr, 12)
		expect(apr.totalApr).toBe(apr.stakerApr + apr.bonusApr)
	})
})

describe("expectedBlockTimeOf", () => {
	it("doubles a valid minimum period and falls back to the parachain block time", () => {
		expect(expectedBlockTimeOf(3_000n)).toBe(6_000)
		expect(expectedBlockTimeOf(0n)).toBe(12_000)
	})
})

describe("stakePercentageOf", () => {
	it("divides the staked amount by the free balance", () => {
		expect(stakePercentageOf(0n, 0n)).toBe(0)
		expect(stakePercentageOf(1n, 4n)).toBe(0.25)
	})
})
