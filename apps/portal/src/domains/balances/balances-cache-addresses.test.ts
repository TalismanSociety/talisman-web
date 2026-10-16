// @vitest-environment node
import type { IBalance } from "@talismn/balances"
import { describe, expect, it } from "vitest"

import { keepAddresses } from "./balances-cache"

const GUARDIAN = "5CcU6DRpocLUWYJHuNLjB4gGyHJrkWuruQD5XFbRYffCfSAP"
const GUARDIAN_ON_KUSAMA = "D85kXmhRyMQGC7jg59n523H7sb6ZBj3Mn3puusP2TshQLGx"
const LOOKUP = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"

const taoBalance = (address: string): IBalance => ({
	source: "substrate-native",
	status: "cache",
	address,
	tokenId: "bittensor:substrate-native",
	networkId: "bittensor",
	values: [{ type: "free", label: "free", amount: "1745553845" }],
})

const rootStake = {
	type: "extra" as const,
	label: "subtensor-staking",
	amount: "249999999",
	includeInTotal: true,
}

describe("keepAddresses", () => {
	it("keeps the balances and stakes of the given addresses, whatever their encoding", () => {
		const tokenRates = {}

		expect(
			keepAddresses(
				{
					balances: [taoBalance(GUARDIAN), taoBalance(LOOKUP)],
					subtensorStakes: new Map([
						[GUARDIAN, [rootStake]],
						[LOOKUP, [rootStake]],
					]),
					tokenRates,
				},
				[GUARDIAN_ON_KUSAMA]
			)
		).toEqual({
			balances: [taoBalance(GUARDIAN)],
			subtensorStakes: new Map([[GUARDIAN, [rootStake]]]),
			tokenRates,
		})
	})
})
