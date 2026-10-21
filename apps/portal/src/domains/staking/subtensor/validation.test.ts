// @vitest-environment node
import { readFileSync } from "node:fs"
import { gunzipSync } from "node:zlib"
import { getLookupFn } from "@polkadot-api/metadata-builders"
import { decAnyMetadata, unifyMetadata } from "@polkadot-api/substrate-bindings"
import { describe, expect, it } from "vitest"

import { constantOf } from "@/domains/chains/chain-runtime"
import { Decimal } from "@/util/Decimal"

import { moveStakeError, unstakeError } from "./validation"

const INITIAL_MIN_STAKE = 2_000_000n
const INITIAL_MIN_TRANSFER = 100_000n

const tao = (planck: bigint) => Decimal.fromPlanck(planck, 9, { currency: "TAO" })
const minStake = tao(INITIAL_MIN_STAKE)
const minTransfer = tao(INITIAL_MIN_TRANSFER)

describe("unstakeError", () => {
	it("allows a full unstake of a root stake below the old 0.1 TAO floor", () => {
		expect(unstakeError(99_900_000n, 99_900_000n, minStake)).toBeUndefined()
	})

	it("allows a full unstake of a stake below the chain minimum", () => {
		expect(unstakeError(1_000_000n, 1_000_000n, minStake)).toBeUndefined()
	})

	it("allows a partial unstake leaving a remainder below the chain minimum", () => {
		expect(unstakeError(249_000_000n, 250_000_000n, minStake)).toBeUndefined()
	})

	it("rejects a partial unstake below the chain minimum", () => {
		expect(unstakeError(1_000_000n, 250_000_000n, minStake)?.message).toBe(
			"Minimum unstake amount is 0.002 TAO"
		)
	})

	it("allows a partial unstake of exactly the chain minimum", () => {
		expect(unstakeError(INITIAL_MIN_STAKE, 250_000_000n, minStake)).toBeUndefined()
	})

	it("rejects an amount above the available stake", () => {
		expect(unstakeError(250_000_001n, 250_000_000n, minStake)?.message).toBe("Insufficient balance")
	})
})

describe("moveStakeError", () => {
	it("allows moving a position above the transfer minimum", () => {
		expect(moveStakeError(99_900_000n, minTransfer)).toBeUndefined()
	})

	it("allows moving a position of exactly the transfer minimum", () => {
		expect(moveStakeError(INITIAL_MIN_TRANSFER, minTransfer)).toBeUndefined()
	})

	it("rejects moving a position below the transfer minimum", () => {
		expect(moveStakeError(50_000n, minTransfer)).toBe(
			"Minimum staked amount for changing validator is 0.0001 TAO"
		)
	})
})

describe("bittensor metadata", () => {
	const lookup = getLookupFn(
		unifyMetadata(
			decAnyMetadata(
				new Uint8Array(
					gunzipSync(
						readFileSync(new URL("./fixtures/bittensor-metadata.scale.gz", import.meta.url))
					)
				)
			)
		)
	)

	it("exposes the unstake and move minimums as SubtensorModule constants", () => {
		expect(constantOf<bigint>(lookup, "SubtensorModule", "InitialMinStake")).toBe(INITIAL_MIN_STAKE)
		expect(constantOf<bigint>(lookup, "SubtensorModule", "InitialMinTransfer")).toBe(
			INITIAL_MIN_TRANSFER
		)
	})
})
