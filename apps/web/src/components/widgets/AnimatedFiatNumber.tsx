import { AnimatedNumber } from '@talismn/ui'
import { useMemo } from 'react'

export type AnimatedFiatNumberProps = {
  end: number
}

// TODO: multi currency compat
const AnimatedFiatNumber = (props: AnimatedFiatNumberProps) => (
  <AnimatedNumber
    end={props.end}
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
)

export default AnimatedFiatNumber
