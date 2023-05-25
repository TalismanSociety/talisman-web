import { AnimatedNumber } from '@talismn/ui'
import { useMemo } from 'react'
import RedactableBalance from './RedactableBalance'

export type AnimatedFiatNumberProps = {
  animate?: boolean
  end: number
}

// TODO: multi currency compat
const AnimatedFiatNumber = ({ animate = true, end }: AnimatedFiatNumberProps) => (
  <RedactableBalance>
    <AnimatedNumber
      animate={animate}
      end={end}
      decimals={2}
      formatter={useMemo(
        () =>
          Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: 'usd',
            currencyDisplay: 'narrowSymbol',
          }),
        []
      )}
    />
  </RedactableBalance>
)

export default AnimatedFiatNumber
