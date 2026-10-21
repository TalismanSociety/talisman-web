import type { Decimal } from "@/util/Decimal"

export const unstakeError = (
	amount: bigint,
	available: bigint,
	minimum: Decimal
): Error | undefined => {
	if (amount > available) return new Error("Insufficient balance")
	if (amount < minimum.planck)
		return new Error(`Minimum unstake amount is ${minimum.toLocaleStringPrecision()}`)
	const remainder = available - amount
	if (remainder > 0n && remainder < minimum.planck)
		return new Error(`You must keep ${minimum.toLocaleString()} to continue staking`)
	return undefined
}

export const moveStakeError = (amount: bigint, minimum: Decimal): string | undefined =>
	amount < minimum.planck
		? `Minimum staked amount for changing validator is ${minimum.toLocaleStringPrecision()}`
		: undefined
