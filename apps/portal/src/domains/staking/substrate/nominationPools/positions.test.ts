// @vitest-environment node
import { describe, expect, it } from "vitest"

import { poolStatus, poolUnbonding } from "./positions"

const member = (unbondingEras: [number, bigint][]) => ({
	pool_id: 15,
	points: 36_340_000_000n,
	last_recorded_reward_counter: 0n,
	unbonding_eras: unbondingEras,
})

describe("pool unbonding", () => {
	it("splits the unbonding eras into withdrawable and still unlocking at the active era", () => {
		expect(
			poolUnbonding(
				member([
					[8_853, 10_000_000_000n],
					[8_900, 5n],
					[8_903, 7n],
				]),
				8_900
			)
		).toEqual({
			withdrawable: 10_000_000_005n,
			unlockings: [{ amount: 7n, erasTilWithdrawable: 3 }],
		})
	})

	it("has nothing to withdraw without unbonding eras", () => {
		expect(poolUnbonding(member([]), 1)).toEqual({ withdrawable: 0n, unlockings: [] })
	})
})

describe("pool status", () => {
	it("is not earning without points, not nominating without targets, then earning or waiting", () => {
		expect(poolStatus(0n, ["a"], true)).toBe("not_earning_rewards")
		expect(poolStatus(1n, [], true)).toBe("not_nominating")
		expect(poolStatus(1n, ["a"], true)).toBe("earning_rewards")
		expect(poolStatus(1n, ["a"], false)).toBe("waiting")
	})
})
