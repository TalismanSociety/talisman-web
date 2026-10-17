import type { Transaction, TypedApi } from "polkadot-api"

import type { PortalRuntime, SmartContract } from "@/domains/chains/portal-runtime"

export type DappStakingTxApi = TypedApi<PortalRuntime, false>["tx"]

export type RewardClaims = {
	stakerRewards: bigint
	claimableSpanCount: number
	bonusRewards: Array<{ contract: SmartContract }>
}

export type AddStake = RewardClaims & {
	contract: SmartContract
	amount: bigint
	lockedAvailableForStake: bigint
	cleanup: boolean
}

const batchAll = (tx: DappStakingTxApi, calls: Transaction[]) =>
	tx.Utility.batch_all({ calls: calls.map((call) => call.decodedCall) })

const claimRewards = (tx: DappStakingTxApi, claims: RewardClaims) => [
	...Array.from({ length: claims.stakerRewards === 0n ? 0 : claims.claimableSpanCount }, () =>
		tx.DappStaking.claim_staker_rewards()
	),
	...claims.bonusRewards.map(({ contract }) =>
		tx.DappStaking.claim_bonus_reward({ smart_contract: contract })
	),
]

const amountToLock = (stake: Pick<AddStake, "amount" | "lockedAvailableForStake">) =>
	stake.amount > stake.lockedAvailableForStake ? stake.amount - stake.lockedAvailableForStake : 0n

export const claimAllRewardsTx = (tx: DappStakingTxApi, claims: RewardClaims) => {
	const calls = claimRewards(tx, claims)
	const [only] = calls
	return calls.length === 1 && only !== undefined ? only : batchAll(tx, calls)
}

export const addStakeTx = (tx: DappStakingTxApi, stake: AddStake) => {
	const lock = amountToLock(stake)
	const before = [
		...claimRewards(tx, stake),
		...(lock === 0n ? [] : [tx.DappStaking.lock({ amount: lock })]),
		...(stake.cleanup ? [tx.DappStaking.cleanup_expired_entries()] : []),
	]
	const stakeCall = tx.DappStaking.stake({ smart_contract: stake.contract, amount: stake.amount })
	return before.length === 0 ? stakeCall : batchAll(tx, [...before, stakeCall])
}

export const maxStakeTx = (tx: DappStakingTxApi, stake: Omit<AddStake, "cleanup">) => {
	const lock = amountToLock(stake)
	const stakeCall = tx.DappStaking.stake({ smart_contract: stake.contract, amount: stake.amount })
	return lock === 0n
		? stakeCall
		: batchAll(tx, [...claimRewards(tx, stake), tx.DappStaking.lock({ amount: lock }), stakeCall])
}

export const unstakeTx = (
	tx: DappStakingTxApi,
	unstake: RewardClaims & { contract: SmartContract; amount: bigint }
) =>
	batchAll(tx, [
		...claimRewards(tx, unstake),
		tx.DappStaking.unstake({ smart_contract: unstake.contract, amount: unstake.amount }),
		tx.DappStaking.unlock({ amount: unstake.amount }),
	])

export const unlockTx = (tx: DappStakingTxApi, amount: bigint) => tx.DappStaking.unlock({ amount })

export const withdrawUnbondedTx = (tx: DappStakingTxApi) => tx.DappStaking.withdraw_unbonded()
