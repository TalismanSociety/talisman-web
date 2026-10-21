import type { Decimal } from "@/util/Decimal"

export const unstakeError = ({
	amount,
	available,
	taoReceived,
	minStake,
	minKeep,
	nominatorMinStake,
}: {
	amount: bigint
	available: Decimal
	taoReceived: bigint
	minStake: Decimal
	minKeep: bigint
	nominatorMinStake: Decimal
}): Error | undefined => {
	const remaining = available.planck - amount
	if (remaining < 0n) return new Error("Insufficient balance")
	if (remaining === 0n) return undefined
	if (taoReceived < minStake.planck)
		return new Error(`Minimum unstake amount is ${minStake.toLocaleStringPrecision()}`)
	if (remaining >= minKeep) return undefined

	const closes = `Bittensor closes stakes worth less than ${nominatorMinStake.toLocaleStringPrecision()}.`
	const maxPartial = available.planck - minKeep
	return maxPartial > 0n && (maxPartial * taoReceived) / amount >= minStake.planck
		? new Error(
				`${closes} Unstake everything, or at most ${available.map(() => maxPartial).toLocaleStringPrecision()}.`
			)
		: new Error(`${closes} Unstake everything.`)
}

export const moveStakeError = (taoValue: bigint, minTransfer: Decimal): string | undefined =>
	taoValue < minTransfer.planck
		? `Minimum staked amount for changing validator is ${minTransfer.toLocaleStringPrecision()}`
		: undefined
