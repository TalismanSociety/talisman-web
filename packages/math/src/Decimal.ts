import { BN, bnToBn, formatBalance } from '@polkadot/util'
import { type ToBn } from '@polkadot/util/types'

export default class Decimal {
  // Too large values lead to massive memory usage. Limit to something sensible.
  static #maxDecimal = 100

  static fromPlanck(planck: string | number | bigint | BN | ToBn | undefined, decimals: number, unit?: string) {
    return new Decimal(bnToBn(planck), decimals, unit)
  }

  static fromPlanckOrUndefined(
    planck: string | number | bigint | BN | ToBn | undefined,
    decimals: number,
    unit?: string
  ) {
    try {
      return this.fromPlanck(planck, decimals, unit)
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

    return new Decimal(bnToBn(quantity), decimals, unit)
  }

  static fromUserInputOrUndefined(input: string, decimals: number, unit?: string) {
    try {
      return this.fromUserInput(input, decimals, unit)
    } catch {
      return undefined
    }
  }

  private constructor(public planck: BN, public decimals: number, public unit?: string) {}

  toNumber() {
    return Number(this.toString())
  }

  toString() {
    const factor = new BN(10).pow(new BN(this.decimals))
    const whole = this.planck.div(factor)
    const fractional = this.planck.mod(factor)

    if (fractional.isZero()) {
      return whole.toString()
    } else {
      const fullFractionalPart = fractional.toString().padStart(this.decimals, '0')
      const trimmedFractionalPart = fullFractionalPart.replace(/0+$/, '')
      return `${whole.toString()}.${trimmedFractionalPart}`
    }
  }

  toHuman(options = { withUnit: true }) {
    const raw = formatBalance(this.planck, {
      forceUnit: '-',
      withUnit: false,
      decimals: this.decimals,
    })

    const stringWithoutUnit = raw.includes('.') ? raw.replace(/0+$/, '') : raw

    return (
      stringWithoutUnit.replace(/\.0*$/, '') +
      (options.withUnit && this.unit !== undefined ? ` ${this.unit?.toUpperCase()}` : '')
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
