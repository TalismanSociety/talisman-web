import { Pendor, Pill } from '@components'
import { ReactComponent as Loader } from '@icons/loader.svg'
import { usePortfolio } from '@libs/portfolio'
import { useAccountAddresses } from '@libs/talisman'
import { addBigNumbers } from '@talismn/util'
import { device } from '@util/breakpoints'
import { formatCurrency } from '@util/helpers'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const Total = styled(({ id, className }) => {
  const { t } = useTranslation()
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

  return (
    <div className={`wallet-total ${className}`}>
      <div className="title">{t('Portfolio value')}</div>
      {isLoading && (
        <div className="amount">
          <span>{formatCurrency(totalUsd || '0')}</span>
          <Loader />
        </div>
      )}
      {!isLoading && (
        <Pendor
          loader={<div className="amount">{formatCurrency(totalUsd || '0')}</div>}
          require={!isLoading && !!totalUsd}
        >
          <>
            <div className="amount">{totalUsd && formatCurrency(totalUsd)}</div>
            {totalUsdChange && (
              <Pill primary small>
                {formatCurrency(totalUsdChange)}
              </Pill>
            )}
          </>
        </Pendor>
      )}
    </div>
  )
})`
  color: var(--color-text);

  > .title {
    font-size: var(--font-size-xsmall);
    color: var(--color-mid);
    margin: 0;
  }

  > .amount {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: var(--font-size-large);
    @media ${device.sm} {
      font-size: var(--font-size-xlarge);
    }
    @media ${device.md} {
      font-size: var(--font-size-xxlarge);
    }
    font-weight: bold;
    margin: 0;
    line-height: 1.4em;
  }
`

export default Total
