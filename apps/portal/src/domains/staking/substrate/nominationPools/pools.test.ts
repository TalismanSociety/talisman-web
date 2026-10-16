// @vitest-environment node
import { describe, expect, it } from "vitest"

import { commissionPercentOf, sortPools } from "./pools"

const bondedPool = (current?: [number, string]) => ({
	commission: { current },
	member_counter: 1,
	points: 1n,
	roles: { depositor: "d" },
	state: { type: "Open" as const, value: undefined },
})

describe("pool commission", () => {
	it("renders the perbill as polkadot.js's two-decimal percentage", () => {
		expect(commissionPercentOf(bondedPool([125_000_000, "p"]))).toBe(12.5)
		expect(commissionPercentOf(bondedPool([123_456_789, "p"]))).toBe(12.34)
		expect(commissionPercentOf(bondedPool([1_000_000_000, "p"]))).toBe(100)
		expect(commissionPercentOf(bondedPool())).toBe(0)
	})
})

describe("pool order", () => {
	const pools = [
		{ poolId: 1, points: 50n },
		{ poolId: 2, points: 500n },
		{ poolId: 3, points: 5n },
		{ poolId: 4, points: 5_000n },
		{ poolId: 5, points: 400n },
	]

	it("puts the priority pool first, then the other priorities, then recommended, then by points", () => {
		expect(sortPools(pools, 3, [3, 1], [5]).map(({ poolId }) => poolId)).toEqual([3, 1, 5, 4, 2])
	})

	it("sorts by points alone without priorities or recommendations", () => {
		expect(sortPools(pools, undefined, [], []).map(({ poolId }) => poolId)).toEqual([4, 2, 5, 1, 3])
	})
})
