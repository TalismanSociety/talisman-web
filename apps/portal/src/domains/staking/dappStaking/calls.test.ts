// @vitest-environment node
import { readFileSync } from "node:fs"
import { gunzipSync } from "node:zlib"
import { Metadata, TypeRegistry } from "@polkadot/types"
import { expandMetadata } from "@polkadot/types/metadata/decorate"
import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"
import { type Codec, decAnyMetadata, unifyMetadata } from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"
import type { Transaction, TxCallData } from "polkadot-api"
import { describe, expect, it } from "vitest"

import type { SmartContract } from "@/domains/chains/portal-runtime"

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

const registry = new TypeRegistry()
const pjsMetadata = new Metadata(registry, metadataBytes)
registry.setMetadata(pjsMetadata)
const tx = expandMetadata(registry, pjsMetadata).tx as any

type MainStake = {
	totalRewards: { decimalAmount: { planck: bigint } }
	stakerRewards: { decimalAmount: { planck: bigint } }
	claimableSpanCount: number
	bonusRewards: Array<{ dapp: unknown }>
}

const mainStakeOf = ({ stakerRewards, claimableSpanCount }: RewardClaims): MainStake => ({
	totalRewards: { decimalAmount: { planck: stakerRewards } },
	stakerRewards: { decimalAmount: { planck: stakerRewards } },
	claimableSpanCount,
	bonusRewards: [],
})

const getAllRewardsClaimExtrinsics = (stake: MainStake) =>
	(stake.totalRewards?.decimalAmount?.planck ?? 0n) < 0n
		? []
		: [
				...(stake?.stakerRewards?.decimalAmount?.planck === 0n
					? []
					: Array.from({ length: stake.claimableSpanCount }).map(() =>
							tx.dappStaking.claimStakerRewards()
						)),
				...stake.bonusRewards.map((x) => tx.dappStaking.claimBonusReward(x.dapp)),
			]

const mainClaimAll = (stake: MainStake) => {
	const exs = getAllRewardsClaimExtrinsics(stake)
	if (exs.length === 0) return undefined
	if (exs.length === 1) return exs.at(0)
	return tx.utility.batchAll(exs)
}

const pjsContract = (contract: SmartContract) =>
	contract.type === "Evm" ? { Evm: contract.value } : { Wasm: contract.value }

const BigIntMax = (...values: bigint[]) => values.reduce((a, b) => (b > a ? b : a))

const mainAddStake = (stake: AddStake) => {
	const dapp = pjsContract(stake.contract)
	const amountToLock = BigIntMax(stake.amount - stake.lockedAvailableForStake, 0n)
	const exs = [
		...getAllRewardsClaimExtrinsics(mainStakeOf(stake)),
		...(amountToLock === undefined || amountToLock === 0n
			? []
			: [tx.dappStaking.lock(amountToLock ?? 0)]),
		...(stake.cleanup ? [tx.dappStaking.cleanupExpiredEntries()] : []),
		tx.dappStaking.stake(dapp, stake.amount ?? 0),
	]
	return exs.length <= 1 ? exs.at(0) : tx.utility.batchAll(exs)
}

const mainMaxSubmittable = (stake: Omit<AddStake, "cleanup">) => {
	const dapp = pjsContract(stake.contract)
	const amountToLock = BigIntMax(stake.amount - stake.lockedAvailableForStake, 0n)
	if (amountToLock === 0n) return tx.dappStaking.stake(dapp, stake.amount)
	return tx.utility.batchAll([
		...getAllRewardsClaimExtrinsics(mainStakeOf(stake)),
		tx.dappStaking.lock(amountToLock ?? 0n),
		tx.dappStaking.stake(dapp, stake.amount),
	])
}

const mainUnstake = (unstake: RewardClaims & { contract: SmartContract; amount: bigint }) =>
	tx.utility.batchAll([
		...getAllRewardsClaimExtrinsics(mainStakeOf(unstake)),
		tx.dappStaking.unstake(pjsContract(unstake.contract), unstake.amount ?? 0),
		tx.dappStaking.unlock(unstake.amount ?? 0),
	])

const pjsHex = (call: { toHex: () => string } | undefined) => call?.toHex()

const CONTRACTS: SmartContract[] = [
	{ type: "Wasm", value: "ZdpeaiK28o6DzkdVJardFTZEJTAHKG3HgJn5ZPgsPh345Hg" },
	{ type: "Evm", value: "0xe0713a1d29fdaa2dec57179378e1002466cf4208" },
	{ type: "Evm", value: "0xE0713A1D29FDAA2DEC57179378E1002466CF4208" },
]
const AMOUNTS = [0n, 1n, 500n * 10n ** 18n, 123_456_789_012_345_678_901n, 2n ** 128n - 1n]
const LOCKED_AVAILABLE = [0n, 1n, 500n * 10n ** 18n, 2n ** 128n - 1n]
const CLAIMS: RewardClaims[] = [
	{ stakerRewards: 0n, claimableSpanCount: 0 },
	{ stakerRewards: 0n, claimableSpanCount: 3 },
	{ stakerRewards: 7n, claimableSpanCount: 0 },
	{ stakerRewards: 7n, claimableSpanCount: 1 },
	{ stakerRewards: 1_234_567n * 10n ** 12n, claimableSpanCount: 3 },
	{ stakerRewards: 1n, claimableSpanCount: 16 },
]

const addStakes: AddStake[] = CONTRACTS.flatMap((contract) =>
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
		}
		expect(papiHex(addStakeTx(recordingTx, stake))).toBe(
			"0x220b01a39cb3cdc4259f886d407d1b4ab792a7df13d510079dad926758eff96a4043f617000050efe2d6e41a1b"
		)
	})

	it("unlocks 500 ASTR as main does", () => {
		expect(papiHex(unlockTx(recordingTx, 500n * 10n ** 18n))).toBe(
			pjsHex(tx.dappStaking.unlock(500n * 10n ** 18n))
		)
		expect(papiHex(unlockTx(recordingTx, 500n * 10n ** 18n))).toBe("0x220817000050efe2d6e41a1b")
	})

	it("withdraws unbonded funds as main does", () => {
		expect(papiHex(withdrawUnbondedTx(recordingTx))).toBe(pjsHex(tx.dappStaking.withdrawUnbonded()))
		expect(papiHex(withdrawUnbondedTx(recordingTx))).toBe("0x2205")
	})

	it.each(
		CLAIMS.filter(
			({ stakerRewards, claimableSpanCount }) => stakerRewards > 0n && claimableSpanCount > 0
		)
	)("claims all rewards like main: %o", (claims) => {
		expect(papiHex(claimAllRewardsTx(recordingTx, claims))).toBe(
			pjsHex(mainClaimAll(mainStakeOf(claims)))
		)
	})

	it("batches two claims and keeps one claim bare", () => {
		expect(
			papiHex(claimAllRewardsTx(recordingTx, { stakerRewards: 5n, claimableSpanCount: 2 }))
		).toBe("0x0b0208220d220d")
		expect(
			papiHex(claimAllRewardsTx(recordingTx, { stakerRewards: 5n, claimableSpanCount: 1 }))
		).toBe("0x220d")
	})

	it.each(addStakes)("adds stake like main: %o", (stake) => {
		expect(papiHex(addStakeTx(recordingTx, stake))).toBe(pjsHex(mainAddStake(stake)))
	})

	it.each(addStakes.filter(({ cleanup }) => !cleanup))(
		"builds the fee estimate of the maximum stake like main: %o",
		(stake) => {
			expect(papiHex(maxStakeTx(recordingTx, stake))).toBe(pjsHex(mainMaxSubmittable(stake)))
		}
	)

	it.each(unstakes)("unstakes like main: %o", (unstake) => {
		expect(papiHex(unstakeTx(recordingTx, unstake))).toBe(pjsHex(mainUnstake(unstake)))
	})
})
