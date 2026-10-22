import { BigIntMath } from "@/util/BigIntMath"
import { type ChainRuntime, constantOf } from "./chain-runtime"

export class InsufficientFeeBalanceError extends Error {
	override name = "InsufficientFeeBalanceError"

	constructor() {
		super("Insufficient balance to pay the network fee")
	}
}

export const feeSpendableBalance = async ({ api, lookup }: ChainRuntime, address: string) => {
	const { data } = await api.query.System.Account.getValue(address, { at: "best" })
	const existentialDeposit = constantOf<bigint>(lookup, "Balances", "ExistentialDeposit") ?? 0n
	const untouchable = BigIntMath.max(data.frozen - data.reserved, existentialDeposit)
	return BigIntMath.max(data.free - untouchable, 0n)
}
