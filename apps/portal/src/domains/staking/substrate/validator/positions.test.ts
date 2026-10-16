import { describe, expect, it } from "vitest"

import { spanCountOf } from "./chain"
import { redeemableOf, unlockingOf } from "./positions"

const chunks = [
	{ era: 100, value: 5n },
	{ era: 103, value: 7n },
	{ era: 101, value: 1n },
	{ era: 103, value: 3n },
	{ era: 99, value: 20n },
]

describe("unlocking, as pjs derive.staking.account groups it", () => {
	it("groups chunks after the active era by era, ascending, with the eras left", () => {
		expect(unlockingOf(chunks, 100)).toEqual([
			{ remainingEras: 1, value: 1n },
			{ remainingEras: 3, value: 10n },
		])
	})

	it("drops the chunks of the active era and before", () => {
		expect(unlockingOf(chunks, 103)).toEqual([])
	})
})

describe("redeemable, as pjs derive.staking.account sums it", () => {
	it("sums the chunks up to and including the current era", () => {
		expect(redeemableOf(chunks, 101)).toBe(26n)
	})

	it("counts a chunk of the current era while unlocking still lists it after the active era", () => {
		expect(redeemableOf(chunks, 101)).toBe(26n)
		expect(unlockingOf(chunks, 100)).toContainEqual({ remainingEras: 1, value: 1n })
	})

	it("is zero before the first chunk matures", () => {
		expect(redeemableOf(chunks, 98)).toBe(0n)
	})
})

describe("slashing span count, as main's withdraw argument", () => {
	it("is one more than the prior spans, and one for a stash with no spans entry", () => {
		expect(
			spanCountOf({ span_index: 3, last_start: 10, last_nonzero_slash: 0, prior: [1, 2] })
		).toBe(3)
		expect(spanCountOf(undefined)).toBe(1)
	})
})
