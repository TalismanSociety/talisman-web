import { StyledLoader } from '@components/Await'
import { useTotalCrowdloanTotalFiatAmount } from '@domains/crowdloans/hooks'
import { useTotalStaked } from '@domains/staking/hooks'
import styled from '@emotion/styled'
import { useActiveAccount, useBalances } from '@libs/talisman'
import { device } from '@util/breakpoints'
import { PropsWithChildren, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

const TotalAmount = () => {
  const { balances, assetsAmount } = useBalances()
  const address = useActiveAccount().address

  const fiatTotal =
    address !== undefined ? balances?.find({ address: address }).sum.fiat('usd').transferable ?? 0 : assetsAmount
  const crowdloanTotal = useTotalCrowdloanTotalFiatAmount()
  const totalStaked = useTotalStaked()

  const totalPortfolioValue = fiatTotal + crowdloanTotal + (totalStaked.fiatAmount ?? 0)

  return (
    <span>
      {totalPortfolioValue.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        currencyDisplay: 'narrowSymbol',
      })}
    </span>
  )
}

const Total = styled(({ className }: PropsWithChildren<{ className?: string }>) => {
  const { t } = useTranslation()
  return (
    <div className={`wallet-total ${className}`}>
      <div className="title">{t('Portfolio value')}</div>
      <div className="amount">
        <Suspense fallback={<StyledLoader />}>
          <TotalAmount />
        </Suspense>
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
