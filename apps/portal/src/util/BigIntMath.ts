const MULTIPLIER_SCALE = 10n ** 18n

export const BigIntMath = {
	min: (...values: bigint[]) => {
		let min = values[0] ?? 0n
		for (const value of values) if (value < min) min = value
		return min
	},
	max: (...values: bigint[]) => {
		let max = values[0] ?? 0n
		for (const value of values) if (value > max) max = value
		return max
	},
	mulNumber: (value: bigint, multiplier: number) =>
		(value * BigInt(Math.round(multiplier * Number(MULTIPLIER_SCALE)))) / MULTIPLIER_SCALE,
}
