import { StyledLoader } from '@components/Await'
import styled from '@emotion/styled'
import { useActiveAccount, useBalances } from '@libs/talisman'
import { device } from '@util/breakpoints'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

const Total = styled(({ className }: PropsWithChildren<{ className?: string }>) => {
  const { t } = useTranslation()

  const { balances, assetsValue } = useBalances()
  const address = useActiveAccount().address

  const fiatTotal =
    address !== undefined
      ? (balances?.find({ address: address }).sum.fiat('usd').transferable ?? 0).toLocaleString(undefined, {
          style: 'currency',
          currency: 'USD',
          currencyDisplay: 'narrowSymbol',
        }) ?? ' -'
      : assetsValue

  return (
    <div className={`wallet-total ${className}`}>
      <div className="title">{t('Portfolio value')}</div>
      <div className="amount">
        <span>{fiatTotal ?? <StyledLoader />}</span>
      </div>
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
