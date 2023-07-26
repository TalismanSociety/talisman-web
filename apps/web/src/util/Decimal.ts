import { BN, bnToBn, formatBalance } from '@polkadot/util'
import { ToBn } from '@polkadot/util/types'

export default class Decimal {
  // Too large values lead to massive memory usage. Limit to something sensible.
  static #maxDecimal = 100

  static fromPlanck(planck: string | number | bigint | BN | ToBn | undefined, decimals: number, unit?: string) {
    return new Decimal(bnToBn(planck), decimals, unit)
  }

  public static fromUserInput(input: string, decimals: number, unit?: string): Decimal {
    Decimal.#verifyDecimals(decimals)

    const badCharacter = input.match(/[^0-9.]/)
    if (badCharacter) {
      throw new Error(`Invalid character at position ${badCharacter.index! + 1}`)
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
      throw new Error('Got more decimals than supported')
    }

    const quantity = `${whole}${fractional.padEnd(decimals, '0')}`

    return new Decimal(bnToBn(quantity), decimals, unit)
  }

  private constructor(public planck: BN, public decimals: number, public unit?: string) {}

  toNumber() {
    return Number(
      formatBalance(this.planck, {
        forceUnit: '-',
        withSi: false,
        withUnit: false,
        decimals: this.decimals,
      }).replaceAll(',', '')
    )
  }

  // TODO: improve precision
  // but to be honest maybe we shouldn't expect
  // precision from a string representation?
  toString() {
    return formatBalance(this.planck, {
      forceUnit: '-',
      withSi: false,
      withUnit: false,
      decimals: this.decimals,
    }).replaceAll(',', '')
  }

  toHuman(options = { withUnit: true }) {
    const raw = formatBalance(this.planck, {
      forceUnit: '-',
      withUnit: false,
      decimals: this.decimals,
    })

    const stringWithoutUnit = raw.includes('.') ? raw.replace(/0+$/, '') : raw

    return stringWithoutUnit.replace(/\.0*$/, '') + (options.withUnit ? ` ${this.unit?.toUpperCase()}` : '')
  }

  static #verifyDecimals(fractionalDigits: number): void {
    if (!Number.isInteger(fractionalDigits)) throw new Error('Decimals is not an integer')
    if (fractionalDigits < 0) throw new Error('Decimals must not be negative')
    if (fractionalDigits > Decimal.#maxDecimal) {
      throw new Error(`Decimals must not exceed ${Decimal.#maxDecimal}`)
    }
  }
}
