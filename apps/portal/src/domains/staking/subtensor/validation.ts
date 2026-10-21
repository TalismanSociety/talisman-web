import type { Decimal } from "@/util/Decimal"

export const unstakeError = ({
	amount,
	available,
	taoReceived,
	minStake,
}: {
	amount: bigint
	available: bigint
	taoReceived: bigint
	minStake: Decimal
}): Error | undefined => {
	if (amount > available) return new Error("Insufficient balance")
	if (amount < available && taoReceived < minStake.planck)
		return new Error(`Minimum unstake amount is ${minStake.toLocaleStringPrecision()}`)
	return undefined
}

export const moveStakeError = (taoValue: bigint, minTransfer: Decimal): string | undefined =>
	taoValue < minTransfer.planck
		? `Minimum staked amount for changing validator is ${minTransfer.toLocaleStringPrecision()}`
		: undefined
