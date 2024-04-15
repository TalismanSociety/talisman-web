const BigIntMath = {
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
}

export default BigIntMath
