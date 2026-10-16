import { Binary, type SS58String, type TxCallData } from "polkadot-api"

import {
	ROOT_NETUID,
	TALISMAN_FEE_RECEIVER_ADDRESS_BITTENSOR,
	TALISMAN_STAKE_REMARK,
} from "@/components/widgets/staking/subtensor/constants"
import type { ChainRuntime } from "@/domains/chains/chain-runtime"

export type StakeChange = {
	hotkey: SS58String
	netuid: number
	amount: bigint
	limitPrice: bigint
	talismanFee: bigint
}

export type StakeMove = {
	originHotkey: SS58String
	destinationHotkey: SS58String
	netuid: number
	alphaAmount: bigint
}

const call = (pallet: string, name: string, args: object): TxCallData => ({
	type: pallet,
	value: { type: name, value: args },
})

const batchAll = (calls: TxCallData[]) => call("Utility", "batch_all", { calls })

const remark = () =>
	call("System", "remark_with_event", { remark: Binary.fromText(TALISMAN_STAKE_REMARK) })

const talismanFeeTransfer = (value: bigint) =>
	call("Balances", "transfer_keep_alive", {
		dest: { type: "Id", value: TALISMAN_FEE_RECEIVER_ADDRESS_BITTENSOR },
		value,
	})

export const placeholderCall = remark

export const stakeCall = ({ hotkey, netuid, amount, limitPrice, talismanFee }: StakeChange) =>
	netuid === ROOT_NETUID
		? batchAll([
				call("SubtensorModule", "add_stake", { hotkey, netuid, amount_staked: amount }),
				remark(),
			])
		: batchAll([
				call("SubtensorModule", "add_stake_limit", {
					hotkey,
					netuid,
					amount_staked: amount,
					limit_price: limitPrice,
					allow_partial: false,
				}),
				talismanFeeTransfer(talismanFee),
				remark(),
			])

export const unstakeCall = ({ hotkey, netuid, amount, limitPrice, talismanFee }: StakeChange) =>
	netuid === ROOT_NETUID
		? batchAll([
				call("SubtensorModule", "remove_stake", { hotkey, netuid, amount_unstaked: amount }),
				remark(),
			])
		: batchAll([
				call("SubtensorModule", "remove_stake_limit", {
					hotkey,
					netuid,
					amount_unstaked: amount,
					limit_price: limitPrice,
					allow_partial: false,
				}),
				talismanFeeTransfer(talismanFee),
				remark(),
			])

export const moveStakeCall = ({
	originHotkey,
	destinationHotkey,
	netuid,
	alphaAmount,
}: StakeMove) =>
	batchAll([
		call("SubtensorModule", "move_stake", {
			origin_hotkey: originHotkey,
			destination_hotkey: destinationHotkey,
			origin_netuid: netuid,
			destination_netuid: netuid,
			alpha_amount: alphaAmount,
		}),
		remark(),
	])

export const txOf = (runtime: ChainRuntime, txCall: TxCallData) =>
	runtime.api.txFromCallData(runtime.encodeCall(txCall))
