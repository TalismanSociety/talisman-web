import { formatDecimals } from '@talismn/util'
import { formatUsd } from '../../util/numbers'
import { Skeleton } from '@talismn/ui'

type Props = {
  label: string
  symbol?: string
  amount?: number
  price?: number
}

export const BalanceCard: React.FC<Props> = ({ label, symbol, amount, price }) => {
  const amountLoading = amount === undefined || symbol === undefined
  const usdLoading = price === undefined || amountLoading

  return (
    <div
      css={({ color }) => ({
        backgroundColor: color.surface,
        padding: 16,
        borderRadius: 12,
      })}
    >
      <p css={{ fontSize: 14, marginTop: 2 }}>{label}</p>
      <div
        css={({ color }) => ({
          display: 'flex',
          alignItems: 'center',
          color: color.offWhite,
          fontSize: 16,
          marginTop: 4,
          gap: 8,
        })}
      >
        {amountLoading ? (
          <Skeleton.Surface css={{ height: 22.9, width: 120 }} />
        ) : (
          <span>
            {formatDecimals(amount)} {symbol}
          </span>
        )}
        {usdLoading ? (
          <span>
            <Skeleton.Surface css={{ height: 16, width: 60 }} />
          </span>
        ) : (
          <span css={({ color }) => ({ color: color.lightGrey, fontSize: 14 })}>
            {price === 0 ? '' : formatUsd(amount * price)}
          </span>
        )}
      </div>
    </div>
  )
}
