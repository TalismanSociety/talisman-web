import { AnimatedNumber } from '@talismn/ui'
import { useMemo } from 'react'
import RedactableBalance from './RedactableBalance'
import { useRecoilValue } from 'recoil'
import { selectedCurrencyState } from '@domains/balances'

export type AnimatedFiatNumberProps = {
  animate?: boolean
  end: number
  currency?: string
}

const AnimatedFiatNumber = ({ animate = true, end, currency }: AnimatedFiatNumberProps) => {
  const recoilCurrency = useRecoilValue(selectedCurrencyState)
  return (
    <RedactableBalance>
      <AnimatedNumber
        animate={animate}
        end={end}
        decimals={2}
        formatter={useMemo(
          () =>
            Intl.NumberFormat(undefined, {
              style: 'currency',
              currency: currency ?? recoilCurrency,
            }),
          [recoilCurrency, currency]
        )}
      />
    </RedactableBalance>
  )
}

export default AnimatedFiatNumber
