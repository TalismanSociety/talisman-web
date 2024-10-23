import { AssetAmount } from '@galacticcouncil/xcm-core'
import BigNumber from 'bignumber.js'

export const toPreciseDecimals = (amount?: AssetAmount): string | undefined =>
  amount
    ? BigNumber(String(amount.amount ?? 0n))
        .times(BigNumber(10).pow(-1 * (amount.decimals ?? 0)))
        .toString()
    : undefined
