import { AnimatedNumber } from '@talismn/ui/atoms/AnimatedNumber'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import { RedactableBalance } from '@/components/widgets/RedactableBalance'
import { selectedCurrencyState } from '@/domains/balances/currency'

export type AnimatedFiatNumberProps = {
  animate?: boolean
  end: number
  currency?: string
}

export const AnimatedFiatNumber = ({ animate = true, end, currency }: AnimatedFiatNumberProps) => {
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
