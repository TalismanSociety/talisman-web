import { usePortfolio } from '@libs/portfolio'
import { formatCurrency } from '@util/helpers'
import styled from 'styled-components'

const Total = styled(({ id, className }) => {
  const { totalUsd } = usePortfolio()

  return (
    <div className={`wallet-total ${className}`}>
      <div className="title">Your portfolio value</div>
      <div className="amount">{totalUsd && formatCurrency(totalUsd)}</div>
    </div>
  )
})`
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
