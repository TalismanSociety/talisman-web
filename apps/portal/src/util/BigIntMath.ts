const MULTIPLIER_SCALE = 10n ** 18n

export const BigIntMath = {
	min: (...values: bigint[]) =>
		values.reduce<bigint | undefined>(
			(prev, curr) => (prev === undefined ? curr : prev < curr ? prev : curr),
			undefined
		) ?? 0n,
	max: (...values: bigint[]) =>
		values.reduce<bigint | undefined>(
			(prev, curr) => (prev === undefined ? curr : prev > curr ? prev : curr),
			undefined
		) ?? 0n,
	mulNumber: (value: bigint, multiplier: number) =>
		(value * BigInt(Math.round(multiplier * Number(MULTIPLIER_SCALE)))) / MULTIPLIER_SCALE,
}
