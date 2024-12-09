import { AnimatedNumber } from '@talismn/ui/atoms/AnimatedNumber'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import { selectedCurrencyState } from '@/domains/balances'

import RedactableBalance from './RedactableBalance'

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
