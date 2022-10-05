import { StyledLoader } from '@components/Await'
import { useActiveAccount, useBalances } from '@libs/talisman'
import { device } from '@util/breakpoints'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const Total = styled(({ id, className }) => {
  const { t } = useTranslation()

  const { balances, assetsValue } = useBalances()
  const address = useActiveAccount().address

  let fiatTotal: string | null = null

  if (!address) fiatTotal = assetsValue
  else
    fiatTotal =
      typeof balances?.find({ address: address })?.sum?.fiat('usd').transferable === 'number'
        ? new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: 'usd',
            currencyDisplay: 'narrowSymbol',
          }).format(balances?.find({ address: address })?.sum?.fiat('usd').transferable || 0)
        : '-'

  return (
    <div className={`wallet-total ${className}`}>
      <div className="title">{t('Portfolio value')}</div>
      <div className="amount">
        <span>{!!fiatTotal ? fiatTotal : <StyledLoader />}</span>
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
