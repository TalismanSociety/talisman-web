import { AnimatedNumber } from '@talismn/ui/atoms/AnimatedNumber'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import { RedactableBalance } from '@/components/widgets/RedactableBalance'
import { currencyConfig, selectedCurrencyState } from '@/domains/balances/currency'

export type AnimatedFiatNumberProps = {
  animate?: boolean
  end: number
  currency?: string
}

export const AnimatedFiatNumber = ({ animate = true, end, currency: propsCurrency }: AnimatedFiatNumberProps) => {
  const recoilCurrency = useRecoilValue(selectedCurrencyState)
  const currency = (propsCurrency ?? recoilCurrency) as keyof typeof currencyConfig

  const formatter = useMemo(
    () =>
      (value: number): string =>
        Intl.NumberFormat(undefined, {
          style: 'currency',
          currency,
          currencyDisplay: 'code',
        })
          .format(value)
          .toLowerCase()
          .replace(currency, currencyConfig[currency]?.symbol ?? currency.toUpperCase()),
    [currency]
  )

  return (
    <RedactableBalance>
      <AnimatedNumber animate={animate} end={end} decimals={2} formatter={formatter} />
    </RedactableBalance>
  )
}
