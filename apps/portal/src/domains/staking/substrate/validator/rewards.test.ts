import { describe, expect, it } from "vitest"

import { type EraInputs, type ExposurePage, stakerRewardsOf } from "./rewards"

const NOMINATOR = "nominator"
const OTHER = "other"
const VALIDATOR = "validator"
const SECOND = "second"

const page = (others: [string, bigint][], pageTotal?: bigint): ExposurePage => ({
	pageTotal: pageTotal ?? others.reduce((total, [, value]) => total + value, 0n),
	others: others.map(([who, value]) => ({ who, value })),
})

const era = (index: number, inputs: Partial<EraInputs>): EraInputs => ({
	era: index,
	pages: [],
	eraPoints: 20n,
	validatorPoints: new Map([[VALIDATOR, 10n]]),
	commissions: new Map([[VALIDATOR, 100_000_000n]]),
	eraReward: 1_000n,
	...inputs,
})

const staker = (
	stash: string,
	claimedRewardsEras: number[] = [],
	legacyClaimedRewards: number[] = []
) => ({
	stash,
	claimedRewardsEras,
	legacyClaimedRewards,
})

const noClaims = new Map<string, number[]>()

describe("staker rewards, as pjs stakerRewardsMultiEras sums them", () => {
	it("pays a nominator its page share of the validator reward after commission", () => {
		const inputs = era(1, {
			pages: [
				[
					VALIDATOR,
					page([
						[NOMINATOR, 100n],
						[OTHER, 900n],
					]),
				],
			],
		})
		expect(stakerRewardsOf([inputs], staker(NOMINATOR), noClaims)).toBe(45n)
	})

	it("divides by the page total, not the validator total", () => {
		const inputs = era(1, {
			pages: [
				[
					VALIDATOR,
					page(
						[
							[NOMINATOR, 100n],
							[OTHER, 900n],
						],
						2_000n
					),
				],
			],
		})
		expect(stakerRewardsOf([inputs], staker(NOMINATOR), noClaims)).toBe(22n)
	})

	it("keeps only the last enumerated page of a validator, so an earlier page earns nothing", () => {
		const first = page([
			[NOMINATOR, 100n],
			[OTHER, 900n],
		])
		const last = page([[OTHER, 1_000n]])
		const inputs = era(1, {
			pages: [
				[VALIDATOR, first],
				[VALIDATOR, last],
			],
		})
		expect(stakerRewardsOf([inputs], staker(NOMINATOR), noClaims)).toBe(0n)
		const reversed = era(1, {
			pages: [
				[VALIDATOR, last],
				[VALIDATOR, first],
			],
		})
		expect(stakerRewardsOf([reversed], staker(NOMINATOR), noClaims)).toBe(45n)
	})

	it("pays a validator stash its commission only", () => {
		const inputs = era(1, { pages: [[VALIDATOR, page([[NOMINATOR, 1_000n]])]] })
		expect(stakerRewardsOf([inputs], staker(VALIDATOR), noClaims)).toBe(50n)
	})

	it("sums every nominated validator over every era", () => {
		const one = era(1, {
			pages: [
				[
					VALIDATOR,
					page([
						[NOMINATOR, 100n],
						[OTHER, 900n],
					]),
				],
				[
					SECOND,
					page([
						[NOMINATOR, 500n],
						[OTHER, 500n],
					]),
				],
			],
			validatorPoints: new Map([
				[VALIDATOR, 10n],
				[SECOND, 10n],
			]),
		})
		const two = era(2, {
			pages: [
				[
					VALIDATOR,
					page([
						[NOMINATOR, 100n],
						[OTHER, 900n],
					]),
				],
			],
		})
		expect(stakerRewardsOf([one, two], staker(NOMINATOR), noClaims)).toBe(45n + 250n + 45n)
	})

	it("earns nothing in an era without points, reward or page total", () => {
		const exposure: [string, ExposurePage][] = [[VALIDATOR, page([[NOMINATOR, 100n]])]]
		expect(
			stakerRewardsOf([era(1, { pages: exposure, eraPoints: 0n })], staker(NOMINATOR), noClaims)
		).toBe(0n)
		expect(
			stakerRewardsOf(
				[era(1, { pages: exposure, validatorPoints: new Map() })],
				staker(NOMINATOR),
				noClaims
			)
		).toBe(0n)
		expect(
			stakerRewardsOf([era(1, { pages: exposure, eraReward: 0n })], staker(NOMINATOR), noClaims)
		).toBe(0n)
		expect(
			stakerRewardsOf(
				[era(1, { pages: [[VALIDATOR, page([[NOMINATOR, 100n]], 0n)]] })],
				staker(NOMINATOR),
				noClaims
			)
		).toBe(0n)
	})

	it("skips an era the staker already claimed, by ledger or by claimed pages", () => {
		const inputs = era(1, {
			pages: [
				[
					VALIDATOR,
					page([
						[NOMINATOR, 100n],
						[OTHER, 900n],
					]),
				],
			],
		})
		expect(stakerRewardsOf([inputs], staker(NOMINATOR, [], [1]), noClaims)).toBe(0n)
		expect(stakerRewardsOf([inputs], staker(NOMINATOR, [1]), noClaims)).toBe(0n)
		expect(stakerRewardsOf([inputs], staker(NOMINATOR, [2], [3]), noClaims)).toBe(45n)
	})

	it("skips a validator whose ledger already claimed the era", () => {
		const inputs = era(1, {
			pages: [
				[
					VALIDATOR,
					page([
						[NOMINATOR, 100n],
						[OTHER, 900n],
					]),
				],
				[
					SECOND,
					page([
						[NOMINATOR, 500n],
						[OTHER, 500n],
					]),
				],
			],
			validatorPoints: new Map([
				[VALIDATOR, 10n],
				[SECOND, 10n],
			]),
		})
		expect(stakerRewardsOf([inputs], staker(NOMINATOR), new Map([[VALIDATOR, [1]]]))).toBe(250n)
	})

	it("earns nothing when the staker is exposed to no validator", () => {
		const inputs = era(1, { pages: [[VALIDATOR, page([[OTHER, 1_000n]])]] })
		expect(stakerRewardsOf([inputs], staker(NOMINATOR), noClaims)).toBe(0n)
	})
})
