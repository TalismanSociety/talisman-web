// @vitest-environment node
import { readFileSync } from "node:fs"
import { gunzipSync } from "node:zlib"
import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"
import { type Codec, decAnyMetadata, unifyMetadata } from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"
import type { Transaction, TxCallData } from "polkadot-api"
import { describe, expect, it } from "vitest"

import type { SmartContract } from "@/domains/chains/portal-runtime"
import { loadPjsOracle } from "@/test/pjs-oracle"

import {
	type AddStake,
	addStakeTx,
	claimAllRewardsTx,
	type DappStakingTxApi,
	maxStakeTx,
	type RewardClaims,
	unlockTx,
	unstakeTx,
	withdrawUnbondedTx,
} from "./calls"

const metadataBytes = new Uint8Array(
	gunzipSync(readFileSync(new URL("./fixtures/astar-metadata.scale.gz", import.meta.url)))
)

const lookup = getLookupFn(unifyMetadata(decAnyMetadata(metadataBytes)))
const callCodec = getDynamicBuilder(lookup).buildDefinition(lookup.call!) as Codec<TxCallData>

const recordingTx = new Proxy(
	{},
	{
		get: (_, pallet: string) =>
			new Proxy(
				{},
				{
					get: (_, name: string) => (value?: unknown) => ({
						decodedCall: { type: pallet, value: { type: name, value } },
					}),
				}
			),
	}
) as DappStakingTxApi

const papiHex = (tx: Transaction | undefined) =>
	tx === undefined ? undefined : toHex(callCodec.enc(tx.decodedCall))

const pjsHex = loadPjsOracle(new URL("./fixtures/calls.pjs.json.gz", import.meta.url))

const CONTRACTS: SmartContract[] = [
	{ type: "Wasm", value: "ZdpeaiK28o6DzkdVJardFTZEJTAHKG3HgJn5ZPgsPh345Hg" },
	{ type: "Evm", value: "0xe0713a1d29fdaa2dec57179378e1002466cf4208" },
	{ type: "Evm", value: "0xE0713A1D29FDAA2DEC57179378E1002466CF4208" },
]
const AMOUNTS = [0n, 1n, 500n * 10n ** 18n, 123_456_789_012_345_678_901n, 2n ** 128n - 1n]
const LOCKED_AVAILABLE = [0n, 1n, 500n * 10n ** 18n, 2n ** 128n - 1n]
type MainClaims = Omit<RewardClaims, "bonusRewards">

const withoutBonus = <T extends MainClaims>(claims: T) => ({ ...claims, bonusRewards: [] })

const CLAIMS: MainClaims[] = [
	{ stakerRewards: 0n, claimableSpanCount: 0 },
	{ stakerRewards: 0n, claimableSpanCount: 3 },
	{ stakerRewards: 7n, claimableSpanCount: 0 },
	{ stakerRewards: 7n, claimableSpanCount: 1 },
	{ stakerRewards: 1_234_567n * 10n ** 12n, claimableSpanCount: 3 },
	{ stakerRewards: 1n, claimableSpanCount: 16 },
]

const addStakes: Array<Omit<AddStake, "bonusRewards">> = CONTRACTS.flatMap((contract) =>
	AMOUNTS.flatMap((amount) =>
		LOCKED_AVAILABLE.flatMap((lockedAvailableForStake) =>
			CLAIMS.flatMap((claims) =>
				[false, true].map((cleanup) => ({
					...claims,
					contract,
					amount,
					lockedAvailableForStake,
					cleanup,
				}))
			)
		)
	)
)

const unstakes = CONTRACTS.flatMap((contract) =>
	AMOUNTS.flatMap((amount) => CLAIMS.map((claims) => ({ ...claims, contract, amount })))
)

describe("dApp staking calls", () => {
	it("stakes 500 ASTR on the Talisman dApp as a bare stake call", () => {
		const stake: AddStake = {
			contract: { type: "Wasm", value: "ZdpeaiK28o6DzkdVJardFTZEJTAHKG3HgJn5ZPgsPh345Hg" },
			amount: 500n * 10n ** 18n,
			lockedAvailableForStake: 500n * 10n ** 18n,
			cleanup: false,
			stakerRewards: 0n,
			claimableSpanCount: 0,
			bonusRewards: [],
		}
		expect(papiHex(addStakeTx(recordingTx, stake))).toBe(
			"0x220b01a39cb3cdc4259f886d407d1b4ab792a7df13d510079dad926758eff96a4043f617000050efe2d6e41a1b"
		)
	})

	it("unlocks 500 ASTR as main does", () => {
		expect(papiHex(unlockTx(recordingTx, 500n * 10n ** 18n))).toBe(
			pjsHex("unlock", 500n * 10n ** 18n)
		)
		expect(papiHex(unlockTx(recordingTx, 500n * 10n ** 18n))).toBe("0x220817000050efe2d6e41a1b")
	})

	it("withdraws unbonded funds as main does", () => {
		expect(papiHex(withdrawUnbondedTx(recordingTx))).toBe(pjsHex("withdrawUnbonded"))
		expect(papiHex(withdrawUnbondedTx(recordingTx))).toBe("0x2205")
	})

	it.each(
		CLAIMS.filter(
			({ stakerRewards, claimableSpanCount }) => stakerRewards > 0n && claimableSpanCount > 0
		)
	)("claims all rewards like main: %o", (claims) => {
		expect(papiHex(claimAllRewardsTx(recordingTx, withoutBonus(claims)))).toBe(
			pjsHex("claimAll", claims)
		)
	})

	it("batches two claims and keeps one claim bare", () => {
		expect(
			papiHex(
				claimAllRewardsTx(recordingTx, withoutBonus({ stakerRewards: 5n, claimableSpanCount: 2 }))
			)
		).toBe("0x0b0208220d220d")
		expect(
			papiHex(
				claimAllRewardsTx(recordingTx, withoutBonus({ stakerRewards: 5n, claimableSpanCount: 1 }))
			)
		).toBe("0x220d")
	})

	it.each(addStakes)("adds stake like main: %o", (stake) => {
		expect(papiHex(addStakeTx(recordingTx, withoutBonus(stake)))).toBe(pjsHex("addStake", stake))
	})

	it.each(addStakes.filter(({ cleanup }) => !cleanup))(
		"builds the fee estimate of the maximum stake like main: %o",
		(stake) => {
			expect(papiHex(maxStakeTx(recordingTx, withoutBonus(stake)))).toBe(pjsHex("maxStake", stake))
		}
	)

	it.each(unstakes)("unstakes like main: %o", (unstake) => {
		expect(papiHex(unstakeTx(recordingTx, withoutBonus(unstake)))).toBe(pjsHex("unstake", unstake))
	})

	describe("bonus rewards", () => {
		const TALISMAN = CONTRACTS[0]!
		const EVM_DAPP = CONTRACTS[1]!
		const CLAIM_TALISMAN_BONUS =
			"220e01a39cb3cdc4259f886d407d1b4ab792a7df13d510079dad926758eff96a4043f6"
		const CLAIM_EVM_BONUS = "220e00e0713a1d29fdaa2dec57179378e1002466cf4208"
		const CLAIM_STAKER_REWARDS = "220d"
		const bonus = { bonusRewards: [{ contract: TALISMAN }, { contract: EVM_DAPP }] }

		it("claims a lone bonus as a bare call for Wasm and Evm dApps", () => {
			for (const [contract, call] of [
				[TALISMAN, CLAIM_TALISMAN_BONUS],
				[EVM_DAPP, CLAIM_EVM_BONUS],
			] as const) {
				expect(
					papiHex(
						claimAllRewardsTx(recordingTx, {
							stakerRewards: 0n,
							claimableSpanCount: 3,
							bonusRewards: [{ contract }],
						})
					)
				).toBe(`0x${call}`)
			}
		})

		it("claims staker rewards before every dApp bonus in one batch", () => {
			expect(
				papiHex(
					claimAllRewardsTx(recordingTx, { stakerRewards: 5n, claimableSpanCount: 2, ...bonus })
				)
			).toBe(
				`0x0b0210${CLAIM_STAKER_REWARDS}${CLAIM_STAKER_REWARDS}${CLAIM_TALISMAN_BONUS}${CLAIM_EVM_BONUS}`
			)
		})

		it("claims bonuses before locking and staking", () => {
			const stake: AddStake = {
				contract: TALISMAN,
				amount: 500n * 10n ** 18n,
				lockedAvailableForStake: 0n,
				cleanup: false,
				stakerRewards: 5n,
				claimableSpanCount: 1,
				...bonus,
			}
			const lockAndStake = papiHex(addStakeTx(recordingTx, { ...stake, bonusRewards: [] }))
			expect(lockAndStake?.startsWith(`0x0b020c${CLAIM_STAKER_REWARDS}`)).toBe(true)
			expect(papiHex(addStakeTx(recordingTx, stake))).toBe(
				`0x0b0214${CLAIM_STAKER_REWARDS}${CLAIM_TALISMAN_BONUS}${CLAIM_EVM_BONUS}${lockAndStake?.slice(12)}`
			)
			expect(papiHex(maxStakeTx(recordingTx, stake))).toBe(papiHex(addStakeTx(recordingTx, stake)))
		})

		it("claims bonuses before unstaking", () => {
			const unstake = {
				contract: TALISMAN,
				amount: 500n * 10n ** 18n,
				stakerRewards: 0n,
				claimableSpanCount: 0,
			}
			const plain = papiHex(unstakeTx(recordingTx, withoutBonus(unstake)))
			expect(plain?.startsWith("0x0b0208")).toBe(true)
			expect(papiHex(unstakeTx(recordingTx, { ...unstake, ...bonus }))).toBe(
				`0x0b0210${CLAIM_TALISMAN_BONUS}${CLAIM_EVM_BONUS}${plain?.slice(8)}`
			)
		})
	})
})
