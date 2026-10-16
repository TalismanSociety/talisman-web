// @vitest-environment node
import { describe, expect, it } from "vitest"

import { toSubnetPools, toValidators, toValidatorYields, validatorYieldsInput } from "./tda"

describe("toValidators", () => {
	const yuma = {
		hotkey: "5DXdHixxtCvoa6GHKs2Jgrdzc61882Ftx1zN2sYFQuwgL1S1",
		name: "Yuma, a DCG Company",
		global_weighted_stake: "328303810249707",
		global_nominators: 2647,
		active_subnets: 126,
		rank: 2,
	}

	it("keeps the named validators active on a subnet, with the fields the portal shows", () => {
		expect(
			toValidators([
				yuma,
				{ ...yuma, hotkey: "5Unnamed", name: null },
				{ ...yuma, hotkey: "5Inactive", name: "Owner44", active_subnets: 0 },
			])
		).toEqual([
			{
				hotkey: "5DXdHixxtCvoa6GHKs2Jgrdzc61882Ftx1zN2sYFQuwgL1S1",
				name: "Yuma, a DCG Company",
				global_weighted_stake: "328303810249707",
				global_nominators: 2647,
			},
		])
	})

	it("keeps tda's order, which the default validator match by name relies on", () => {
		expect(
			toValidators([
				{ ...yuma, hotkey: "5First", rank: 2 },
				{ ...yuma, hotkey: "5Second", rank: 131 },
			]).map(({ hotkey }) => hotkey)
		).toEqual(["5First", "5Second"])
	})

	it("rejects a payload that is not tda's validator list", () => {
		expect(() => toValidators({ data: [yuma] })).toThrow()
		expect(() => toValidators([{ ...yuma, global_weighted_stake: 1 }])).toThrow()
	})
})

describe("toSubnetPools", () => {
	it("keeps the netuid and the pool reserves in planck strings", () => {
		expect(
			toSubnetPools([
				{
					netuid: 46,
					total_tao: "23027462881153",
					total_alpha: 6135710069537335,
					price: "0.006560824",
					price_change_1_day: "1.04",
					market_cap: "40255313881262.21636404",
					tao_volume_24_hr: "589630042760",
				},
			])
		).toEqual([{ netuid: 46, total_tao: "23027462881153", total_alpha: "6135710069537335" }])
	})

	it("rejects a reserve that is not a whole planck amount", () => {
		expect(() => toSubnetPools([{ netuid: 1, total_tao: "1.5", total_alpha: "1" }])).toThrow()
		expect(() => toSubnetPools([{ netuid: 1, total_tao: "1", total_alpha: -1 }])).toThrow()
	})
})

describe("toValidatorYields", () => {
	it("keeps the validators with a 30-day APY", () => {
		expect(
			toValidatorYields([
				{
					hotkey: "5DXdHixxtCvoa6GHKs2Jgrdzc61882Ftx1zN2sYFQuwgL1S1",
					stake: 121811578278072,
					thirty_day_apy: 0.4428150862607598,
					thirty_day_apy_gross: 0.49608376522780095,
				},
				{ hotkey: "5NoApy", stake: 1, thirty_day_apy: null, thirty_day_apy_gross: null },
			])
		).toEqual([
			{
				hotkey: "5DXdHixxtCvoa6GHKs2Jgrdzc61882Ftx1zN2sYFQuwgL1S1",
				thirty_day_apy: 0.4428150862607598,
			},
		])
	})
})

describe("validatorYieldsInput", () => {
	it.each([0, 46, 65535])("accepts netuid %s", (netuid) => {
		expect(validatorYieldsInput.parse({ netuid })).toEqual({ netuid })
	})

	it.each([-1, 1.5, 65536, Number.NaN, "0", "0/../../validators", null])(
		"rejects netuid %s",
		(netuid) => {
			expect(validatorYieldsInput.safeParse({ netuid }).success).toBe(false)
		}
	)

	it("rejects a missing netuid", () => {
		expect(validatorYieldsInput.safeParse(undefined).success).toBe(false)
	})
})
