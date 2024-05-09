export default class Decimal {
  // Too large values lead to massive memory usage. Limit to something sensible.
  static #maxDecimal = 100

  static fromPlanck(planck: bigint | boolean | number | string, decimals: number, unit?: string) {
    return new Decimal(BigInt(planck), decimals, unit)
  }

  static fromPlanckOrUndefined(
    planck: bigint | boolean | number | string | undefined,
    decimals: number,
    unit?: string
  ) {
    try {
      return this.fromPlanck(planck ?? 0, decimals, unit)
    } catch {
      return undefined
    }
  }

  static fromUserInput(input: string, decimals: number, unit?: string) {
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
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          whole = parts[0]!
          fractional = parts[1].replace(/0+$/, '')
          break
        default:
          throw new Error('More than one separator found')
      }
    }

    if (fractional.length > decimals) {
      throw new Error('Got more decimals than supported')
    }

    const quantity = `${whole}${fractional.padEnd(decimals, '0')}`

    return new Decimal(BigInt(quantity), decimals, unit)
  }

  static fromUserInputOrUndefined(input: string, decimals: number, unit?: string) {
    try {
      return this.fromUserInput(input, decimals, unit)
    } catch {
      return undefined
    }
  }

  private constructor(public planck: bigint, public decimals: number, public unit?: string) {}

  toNumber() {
    return Number(this.toString())
  }

  toString() {
    const paddedPlanck = this.planck.toString().padStart(this.decimals, '0')
    const whole = paddedPlanck.slice(0, paddedPlanck.length - this.decimals)
    const fractional = paddedPlanck.slice(paddedPlanck.length - this.decimals).replace(/0+$/, '')

    if (fractional.length === 0) {
      return whole
    } else {
      return `${whole || '0'}.${fractional}`
    }
  }

  toLocaleString(locales?: Intl.LocalesArgument, options?: Omit<Intl.NumberFormatOptions, 'style'>) {
    return (
      parseFloat(this.toString()).toLocaleString(locales, { ...options, style: 'decimal' }) +
      (this.unit === undefined ? '' : ` ${this.unit}`)
    )
  }

  static #verifyDecimals(fractionalDigits: number): void {
    if (!Number.isInteger(fractionalDigits)) throw new Error('Decimals is not an integer')
    if (fractionalDigits < 0) throw new Error('Decimals must not be negative')
    if (fractionalDigits > Decimal.#maxDecimal) {
      throw new Error(`Decimals must not exceed ${Decimal.#maxDecimal}`)
    }
  }
}
