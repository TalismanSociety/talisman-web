import { useCallback, useMemo } from 'react'
import CountUp from 'react-countup'

export type DisplayValueProps = {
  amount: number
  noCountUp?: boolean
  currency?: string
}

const DisplayValue: React.FC<DisplayValueProps> = ({ amount, noCountUp }) => {
  // if amount is a string parse it to a number
  const format = useCallback((amount = 0) => formatFiat(amount, 'usd'), [])
  const formatted = useMemo(() => format(amount), [amount, format])

  if (noCountUp) return <>{formatted}</>

  return (
    <CountUp
      end={amount}
      duration={0.4}
      decimal={fiatDecimalSeparator}
      separator={fiatGroupSeparator}
      decimals={2}
      formattingFn={format}
      useEasing
      preserveValue
    />
  )
}

const testNumber = 1000.1
const parts = new Intl.NumberFormat(undefined).formatToParts(testNumber)

export const fiatDecimalSeparator = parts.find(p => p.type === 'decimal')?.value ?? '.'

export const fiatGroupSeparator = parts.find(p => p.type === 'group')?.value ?? ','

export const formatFiat = (amount = 0, currency = 'usd') =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
  }).format(amount)

export default DisplayValue
