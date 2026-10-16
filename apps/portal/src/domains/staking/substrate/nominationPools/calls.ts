import type { SS58String, TxCallData } from "polkadot-api"

export type ClaimPermission =
	| "Permissioned"
	| "PermissionlessCompound"
	| "PermissionlessWithdraw"
	| "PermissionlessAll"

const call = (name: string, args?: object): TxCallData => ({
	type: "NominationPools",
	value: { type: name, value: args },
})

const memberAccount = (address: SS58String) => ({ type: "Id", value: address })

export const joinCall = (
	amount: bigint,
	poolId: number,
	permission: ClaimPermission
): TxCallData => ({
	type: "Utility",
	value: {
		type: "batch_all",
		value: {
			calls: [call("join", { amount, pool_id: poolId }), setClaimPermissionCall(permission)],
		},
	},
})

export const bondExtraCall = (amount: bigint) =>
	call("bond_extra", { extra: { type: "FreeBalance", value: amount } })

export const bondRewardsCall = () =>
	call("bond_extra", { extra: { type: "Rewards", value: undefined } })

export const claimPayoutCall = () => call("claim_payout")

export const unbondCall = (member: SS58String, points: bigint) =>
	call("unbond", { member_account: memberAccount(member), unbonding_points: points })

export const withdrawUnbondedCall = (member: SS58String, slashingSpans: number) =>
	call("withdraw_unbonded", {
		member_account: memberAccount(member),
		num_slashing_spans: slashingSpans,
	})

export const setClaimPermissionCall = (permission: ClaimPermission) =>
	call("set_claim_permission", { permission: { type: permission, value: undefined } })
