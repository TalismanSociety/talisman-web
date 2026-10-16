// @vitest-environment node
import { u16 } from "@polkadot-api/substrate-bindings"
import { firstValueFrom } from "rxjs"
import { describe, expect, it, vi } from "vitest"

import fixture from "./fixtures/subtensor-stakes.json"
import { subtensorStakes$ } from "./subtensor-stakes"

const { send } = vi.hoisted(() => ({ send: vi.fn() }))

vi.mock("@/domains/chains/chain-connectors", () => ({ chainConnectors: { substrate: { send } } }))

const dynamicInfo: Record<string, string> = fixture.dynamicInfo

send.mockImplementation(async (_network: string, _method: string, [call, params]: string[]) =>
	call === "StakeInfoRuntimeApi_get_stake_info_for_coldkey"
		? fixture.stakeInfo
		: dynamicInfo[String(u16.dec(params ?? "0x"))]
)

const YUMA = "5DXdHixxtCvoa6GHKs2Jgrdzc61882Ftx1zN2sYFQuwgL1S1"

const stake = (netuid: number, hotkey: string, alpha: string, tao: string) => ({
	type: "extra",
	label: "subtensor-staking",
	amount: tao,
	includeInTotal: true,
	meta: { netuid, hotkey, amountStaked: alpha },
})

describe("subtensorStakes$", () => {
	it("reads Guardians SUB's stakes from the chain's own bytes and prices subnet alpha in TAO", async () => {
		const stakes = await firstValueFrom(subtensorStakes$([fixture.address]))

		expect(Object.fromEntries(stakes)).toEqual({
			[fixture.address]: [
				stake(0, YUMA, "249999999", "249999999"),
				stake(15, "5GKH9FPPnWSUoeeTJp19wVtd84XqFW4pyK2ijV2GsFbhTrP1", "904050223", "19641862"),
				stake(46, YUMA, "6170573131", "23897222"),
				stake(50, YUMA, "4626647180", "18939180"),
				stake(107, YUMA, "557239826", "20168888"),
			],
		})
	})
})
