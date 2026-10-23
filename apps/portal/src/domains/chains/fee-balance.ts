import { BigIntMath } from "@/util/BigIntMath"
import { type ChainRuntime, constantOf } from "./chain-runtime"
import type { AccountInfo } from "./portal-runtime"

const VARA_GENESIS_HASH = "0xfe1b4c55fd4d668101126434206571a7838a8b6b93a6d1b95d607e78e6c53763"

const chainsChargingFeesThroughCurrencyAdapter = new Set<string>([VARA_GENESIS_HASH])

export class InsufficientFeeBalanceError extends Error {
	override name = "InsufficientFeeBalanceError"

	constructor() {
		super("Insufficient balance to pay the network fee")
	}
}

const frozenInFreeBalance = (genesisHash: string, { frozen, reserved }: AccountInfo["data"]) =>
	chainsChargingFeesThroughCurrencyAdapter.has(genesisHash) ? frozen : frozen - reserved

export const feeSpendableBalance = async (
	{ api, lookup }: ChainRuntime,
	genesisHash: string,
	address: string
) => {
	const { data } = await api.query.System.Account.getValue(address, { at: "best" })
	const existentialDeposit = constantOf<bigint>(lookup, "Balances", "ExistentialDeposit") ?? 0n
	const untouchable = BigIntMath.max(frozenInFreeBalance(genesisHash, data), existentialDeposit)
	return BigIntMath.max(data.free - untouchable, 0n)
}
