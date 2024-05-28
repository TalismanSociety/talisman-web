type DecimalOptions = Pick<Intl.NumberFormatOptions, 'currency'>

export default class Decimal {
  // Too large values lead to massive memory usage. Limit to something sensible.
  static #maxDecimal = 100

  static fromPlanck(planck: bigint | boolean | number | string, decimals: number, options?: DecimalOptions) {
    return new Decimal(BigInt(planck), decimals, options)
  }

  static fromPlanckOrUndefined(
    planck: bigint | boolean | number | string | undefined,
    decimals: number,
    options?: DecimalOptions
  ) {
    try {
      return this.fromPlanck(planck ?? 0, decimals, options)
    } catch {
      return undefined
    }
  }

  static fromUserInput(input: string, decimals: number, options?: DecimalOptions) {
    Decimal.#verifyDecimals(decimals)

    const badCharacter = input.match(/[^0-9.]/)
    if (badCharacter) {
      throw new Error(`Invalid character at position ${(badCharacter.index ?? 0) + 1}`)
    }

    let whole: string
    let fractional: string

    if (input.search(/\./) === -1) {
      // integer format, no separator
      whole = input
      fractional = ''
    } else {
      const parts = input.split('.')
      switch (parts.length) {
        case 0:
        case 1:
          throw new Error('Fewer than two elements in split result. This must not happen here.')
        case 2:
          if (!parts[1]) throw new Error('Fractional part missing')

          whole = parts[0]!
          fractional = parts[1].replace(/0+$/, '')
          break
        default:
          throw new Error('More than one separator found')
      }
    }

    if (fractional.length > decimals) {
      fractional = fractional.slice(0, decimals)
    }

    const quantity = `${whole}${fractional.padEnd(decimals, '0')}`

    return new Decimal(BigInt(quantity), decimals, options)
  }

  static fromUserInputOrUndefined(input: string, decimals: number, options?: DecimalOptions) {
    try {
      return this.fromUserInput(input, decimals, options)
    } catch {
      return undefined
    }
  }

  private constructor(
    public readonly planck: bigint,
    public readonly decimals: number,
    public readonly options?: DecimalOptions
  ) {}

  toNumber() {
    return Number(this.toString())
  }

  toString() {
    const paddedPlanck = this.planck.toString().padStart(this.decimals, '0')
    const whole = paddedPlanck.slice(0, paddedPlanck.length - this.decimals).padStart(1, '0')
    const fractional = paddedPlanck.slice(paddedPlanck.length - this.decimals).replace(/0+$/, '')

    if (fractional.length === 0) {
      return whole
    } else {
      return `${whole || '0'}.${fractional}`
    }
  }

  toLocaleString(locales?: Intl.LocalesArgument, options?: Omit<Intl.NumberFormatOptions, 'style'>) {
    const currency = options?.currency ?? this.options?.currency
    return (
      parseFloat(this.toString()).toLocaleString(locales, { ...options, style: 'decimal' }) +
      (currency === undefined ? '' : ` ${currency}`)
    )
  }

  map(mapper: (planck: bigint) => bigint) {
    return Decimal.fromPlanck(mapper(this.planck), this.decimals, this.options)
  }

  mapNumber(mapper: (number: number) => number) {
    return Decimal.fromUserInput(mapper(this.toNumber()).toString(), this.decimals, this.options)
  }

  static #verifyDecimals(fractionalDigits: number): void {
    if (!Number.isInteger(fractionalDigits)) throw new Error('Decimals is not an integer')
    if (fractionalDigits < 0) throw new Error('Decimals must not be negative')
    if (fractionalDigits > Decimal.#maxDecimal) {
      throw new Error(`Decimals must not exceed ${Decimal.#maxDecimal}`)
    }
  }
}
