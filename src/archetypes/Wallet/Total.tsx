import { Pendor, Pill, TextLoader } from '@components'
import { usePortfolio } from '@libs/portfolio'
import { useAccountAddresses } from '@libs/talisman'
import { addBigNumbers } from '@talismn/util'
import { device } from '@util/breakpoints'
import { formatCurrency } from '@util/helpers'
import { useMemo } from 'react'
import styled from 'styled-components'

const Total = styled(({ id, className }) => {
  const accountAddresses = useAccountAddresses()
  const { isLoading, totalUsdByAddress } = usePortfolio()
  // TODO: Price change value
  const totalUsdChange = null //-1000000

  const totalUsd = useMemo(
    () =>
      Object.entries(totalUsdByAddress || {})
        .filter(([address]) => accountAddresses && accountAddresses.includes(address))
        .map(([, usd]) => usd)
        .reduce(addBigNumbers, undefined),
    [totalUsdByAddress, accountAddresses]
  )

  if (totalUsd === undefined) {
    return null
  }

  return (
    <div className={`wallet-total ${className}`}>
      <div className="title">Portfolio value</div>
      <Pendor loader={<TextLoader className="amount">$</TextLoader>} require={!isLoading && !!totalUsd}>
        <>
          <div className="amount">{totalUsd && formatCurrency(totalUsd)}</div>
          {totalUsdChange && (
            <Pill primary small>
              {formatCurrency(totalUsdChange)}
            </Pill>
          )}
        </>
      </Pendor>
    </div>
  )
})`
  color: var(--color-text);
  min-width: 33%;
  flex: 1 0 auto;

  > .title {
    font-size: var(--font-size-xsmall);
    color: var(--color-mid);
    margin: 0;
  }

  > .amount {
    @media ${device.md} {
      font-size: var(--font-size-xlarge);
    }
    @media ${device.lg} {
      font-size: var(--font-size-xxlarge);
    }
    font-weight: bold;
    margin: 0;
    line-height: 1.4em;
  }
`

export default Total
