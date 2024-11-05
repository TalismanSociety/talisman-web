import { AssetAmount } from '@galacticcouncil/xcm-core'
import { formatUnits } from 'viem'

export const toPreciseDecimals = (amount?: AssetAmount): string | undefined =>
  amount ? formatUnits(amount.amount ?? 0n, amount.decimals ?? 0) : undefined
