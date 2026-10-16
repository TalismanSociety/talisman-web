// @vitest-environment node
import { describe, expect, it } from "vitest"

import { assetHubApr, inflationApr } from "./apr"

describe("Asset Hub APR", () => {
	it("is the yearly reward over stake ratio, floored to four decimals", () => {
		expect(assetHubApr([1_000n, 1_000n], [100_000n, 100_000n], 365)).toBe(3.65)
		expect(assetHubApr([123n], [1_000_000n], 730)).toBe(0.0897)
	})

	it("is zero without rewards or stake", () => {
		expect(assetHubApr([0n], [10n], 365)).toBe(0)
		expect(assetHubApr([10n], [0n], 365)).toBe(0)
	})
})

describe("inflation APR", () => {
	it("scales the average era reward to a year over the staked share of the issuance", () => {
		expect(inflationApr([1_000n, 3_000n], 500_000n, 1_000_000n, 1)).toBe(1.46)
		expect(inflationApr([1_000n, 3_000n], 500_000n, 1_000_000n, 4)).toBe(5.84)
	})

	it("keeps main's infinite rate when nothing is staked", () => {
		expect(inflationApr([1_000n], 0n, 1_000_000n, 1)).toBe(Number.POSITIVE_INFINITY)
	})
})
