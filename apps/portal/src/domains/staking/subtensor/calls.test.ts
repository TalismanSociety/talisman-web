// @vitest-environment node
import { readFileSync } from "node:fs"
import { gunzipSync } from "node:zlib"
import { getLookupFn } from "@polkadot-api/metadata-builders"
import { decAnyMetadata, unifyMetadata } from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"
import { describe, expect, it } from "vitest"

import { DEFAULT_VALIDATOR } from "@/components/widgets/staking/subtensor/constants"
import { callEncoderOf } from "@/domains/chains/chain-runtime"
import { loadPjsOracle } from "@/test/pjs-oracle"

import { moveStakeCall, placeholderCall, type StakeChange, stakeCall, unstakeCall } from "./calls"

const metadataBytes = new Uint8Array(
	gunzipSync(readFileSync(new URL("./fixtures/bittensor-metadata.scale.gz", import.meta.url)))
)

const encodeCall = callEncoderOf(getLookupFn(unifyMetadata(decAnyMetadata(metadataBytes))))
const papiHex = (call: Parameters<typeof encodeCall>[0]) => toHex(encodeCall(call))

const pjsHex = loadPjsOracle(new URL("./fixtures/calls.pjs.json.gz", import.meta.url))

const HOTKEYS = [DEFAULT_VALIDATOR.poolId, "5CcU6DRpocLUWYJHuNLjB4gGyHJrkWuruQD5XFbRYffCfSAP"]
const NETUIDS = [0, 2, 46, 128, 65535]
const AMOUNTS = [0n, 1n, 1_000_000n, 100_000_000n, 123_456_789_012n, 2n ** 64n - 1n]
const LIMIT_PRICES = [0n, 1n, 7_031_534n, 2n ** 64n - 1n]
const FEES = [0n, 300_000n, 210_000n, 2n ** 64n - 1n]

const changes: StakeChange[] = HOTKEYS.flatMap((hotkey) =>
	NETUIDS.flatMap((netuid) =>
		AMOUNTS.flatMap((amount, index) => ({
			hotkey,
			netuid,
			amount,
			limitPrice: LIMIT_PRICES[index % LIMIT_PRICES.length] ?? 0n,
			talismanFee: FEES[(index + netuid) % FEES.length] ?? 0n,
		}))
	)
)

describe("subtensor calls", () => {
	it("encodes a root stake of 0.1 TAO as main does", () => {
		const change = {
			hotkey: DEFAULT_VALIDATOR.poolId,
			netuid: 0,
			amount: 100_000_000n,
			limitPrice: 0n,
			talismanFee: 0n,
		}
		expect(papiHex(stakeCall(change))).toBe(
			"0x0b0208070240c47b6a294686fe9612b5d78dd369f4c77fa3bbf96a4286ede97410ba2e3209000000e1f5050000000000072870617072696b61303035"
		)
		expect(papiHex(stakeCall(change))).toBe(pjsHex("stake", change))
	})

	it.each(changes)("stakes like main: %o", (change) => {
		expect(papiHex(stakeCall(change))).toBe(pjsHex("stake", change))
	})

	it.each(changes)("unstakes like main: %o", (change) => {
		expect(papiHex(unstakeCall(change))).toBe(pjsHex("unstake", change))
	})

	it.each(
		HOTKEYS.flatMap((origin) =>
			HOTKEYS.flatMap((destination) =>
				NETUIDS.flatMap((netuid) =>
					AMOUNTS.map((alpha) => [origin, destination, netuid, alpha] as const)
				)
			)
		)
	)("moves stake like main: %s to %s on %i, %s alpha", (origin, destination, netuid, alpha) => {
		expect(
			papiHex(
				moveStakeCall({
					originHotkey: origin,
					destinationHotkey: destination,
					netuid,
					alphaAmount: alpha,
				})
			)
		).toBe(pjsHex("moveStake", origin, destination, netuid, alpha))
	})

	it("uses main's remark as the placeholder", () => {
		expect(papiHex(placeholderCall())).toBe(pjsHex("placeholder"))
		expect(papiHex(placeholderCall())).toBe("0x00072870617072696b61303035")
	})
})
