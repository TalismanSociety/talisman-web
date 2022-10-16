import { BN, formatBalance } from '@polkadot/util'
import { ToBn } from '@polkadot/util/types'

export default class Decimal {
  static fromAtomics(atomics: string | number | bigint | BN | ToBn | undefined, decimals: number, unit?: string) {
    return new Decimal(atomics, decimals, unit)
  }

  protected constructor(
    public atomics: string | number | bigint | BN | ToBn | undefined,
    public decimals: number,
    public unit?: string
  ) {}

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

  toHuman() {
    const raw = formatBalance(this.atomics, {
      forceUnit: '-',
      withUnit: false,
      decimals: this.decimals,
    })

    const stringWithoutUnit = raw.includes('.') ? raw.replace(/0+$/, '') : raw

    return stringWithoutUnit.replace(/\.0*$/, '') + ` ${this.unit?.toUpperCase()}`
  }
}
