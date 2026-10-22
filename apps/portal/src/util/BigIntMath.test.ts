import { describe, expect, it } from "vitest"

import { BigIntMath } from "./BigIntMath"

const TAO = 1_000_000_000n

describe("BigIntMath.mulNumber", () => {
	it.each([
		[TAO, 0.05, 50_000_000n],
		[TAO, 0.18, 180_000_000n],
		[(TAO * 11n) / 10n, 0.05, 55_000_000n],
		[(TAO * 11n) / 10n, 0.18, 198_000_000n],
		[123_456_789n, 0.5, 61_728_394n],
		[2_000_000n, 1.5, 3_000_000n],
		[1_234_567n, 1, 1_234_567n],
		[TAO, 0, 0n],
	])("multiplies %d by %d", (value, multiplier, expected) => {
		expect(BigIntMath.mulNumber(value, multiplier)).toBe(expected)
	})

	it("keeps estimated earnings proportional to the staked amount", () => {
		const oneTao = BigIntMath.mulNumber(TAO, 0.18)
		const oneAndATenthTao = BigIntMath.mulNumber((TAO * 11n) / 10n, 0.18)

		expect(oneAndATenthTao * 10n).toBe(oneTao * 11n)
	})

	it("handles amounts beyond the safe integer range", () => {
		expect(BigIntMath.mulNumber(10n ** 30n, 0.05)).toBe(5n * 10n ** 28n)
	})
})
