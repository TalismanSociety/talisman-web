import { usePortfolio } from '@libs/portfolio'
import { useAccountAddresses } from '@libs/talisman'
import { device } from '@util/breakpoints'
import { formatCurrency } from '@util/helpers'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import styled from 'styled-components'

const Total = styled(({ id, className }) => {
  const accountAddresses = useAccountAddresses()
  const { totalUsdByAddress } = usePortfolio()

  const totalUsd = useMemo(
    () =>
      Object.entries(totalUsdByAddress || {})
        .filter(([address]) => accountAddresses && accountAddresses.includes(address))
        .map(([, usd]) => usd)
        .reduce(addBigNumbers, undefined),
    [totalUsdByAddress, accountAddresses]
  )

  return (
    <div className={`wallet-total ${className}`}>
      <div className="title">Your portfolio value</div>
      <div className="amount">{totalUsd && formatCurrency(totalUsd)}</div>
    </div>
  )
})`
  padding: 2rem;
  border-radius: 1.6rem;
  background: var(--color-controlBackground);
  color: var(--color-text);
  width: 100%;

  @media ${device.md} {
    width: 100%;
  }

  @media ${device.lg} {
    width: auto;
  }

  > .title {
    font-size: var(--font-size-xsmall);
    color: var(--color-mid);
    margin: 0;
  }

  > .amount {
    font-size: var(--font-size-xxlarge);
    font-weight: bold;
    color: var(--color-primary);
    margin: 0;
    line-height: 1.4em;
  }
`

export default Total

// TODO: Dedupe with src/archetypes/Wallet/Assets.tsx and move to @utils

function addBigNumbers(a?: string, b?: string): string | undefined {
  if (!a && !b) return undefined
  if (!a) return b
  if (!b) return a

  return new BigNumber(a).plus(new BigNumber(b)).toString()
}
