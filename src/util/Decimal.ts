import { BN, bnToBn, formatBalance } from '@polkadot/util'
import { ToBn } from '@polkadot/util/types'

// Too large values lead to massive memory usage. Limit to something sensible.
const MAX_FRACTIONAL_DIGITS = 100

export default class Decimal {
  static fromAtomics(atomics: string | number | bigint | BN | ToBn | undefined, decimals: number, unit?: string) {
    return new Decimal(bnToBn(atomics), decimals, unit)
  }

  public static fromUserInput(input: string, fractionalDigits: number, unit?: string): Decimal {
    Decimal.#verifyFractionalDigits(fractionalDigits)

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

    if (fractional.length > fractionalDigits) {
      throw new Error('Got more fractional digits than supported')
    }

    const quantity = `${whole}${fractional.padEnd(fractionalDigits, '0')}`

    return new Decimal(bnToBn(quantity), fractionalDigits, unit)
  }

  private constructor(public atomics: BN, public decimals: number, public unit?: string) {}

  toFloatApproximation() {
    return Number(
      formatBalance(this.atomics, {
        forceUnit: '-',
        withSi: false,
        withUnit: false,
        decimals: this.decimals,
      }).replaceAll(',', '')
    )
  }

  toString() {
    return formatBalance(this.atomics, {
      forceUnit: '-',
      withSi: false,
      withUnit: false,
      decimals: this.decimals,
    }).replaceAll(',', '')
  }

  toHuman() {
    const raw = formatBalance(this.atomics, {
      forceUnit: '-',
      withUnit: false,
      decimals: this.decimals,
    })

    const stringWithoutUnit = raw.includes('.') ? raw.replace(/0+$/, '') : raw

    return stringWithoutUnit.replace(/\.0*$/, '') + ` ${this.unit?.toUpperCase()}`
  }

  static #verifyFractionalDigits(fractionalDigits: number): void {
    if (!Number.isInteger(fractionalDigits)) throw new Error('Fractional digits is not an integer')
    if (fractionalDigits < 0) throw new Error('Fractional digits must not be negative')
    if (fractionalDigits > MAX_FRACTIONAL_DIGITS) {
      throw new Error(`Fractional digits must not exceed ${MAX_FRACTIONAL_DIGITS}`)
    }
  }
}
