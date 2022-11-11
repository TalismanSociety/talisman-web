import { List } from '@archetypes/Transaction'
import { PanelSection } from '@components'
import ExtensionStatusGate from '@components/ExtensionStatusGate'
import styled from '@emotion/styled'
import { useAllAccountAddresses } from '@libs/talisman'
import { device } from '@util/breakpoints'
import { useTranslation } from 'react-i18next'

type ExtensionUnavailableProps = {
  props?: any
}

const ExtensionUnavailable = styled((props: ExtensionUnavailableProps) => {
  const { t } = useTranslation()
  return (
    <PanelSection comingSoon {...props}>
      <p>{t('extensionUnavailable.subtitle')}</p>
      <p>{t('extensionUnavailable.text')}</p>
    </PanelSection>
  )
})`
  text-align: center;

  > *:not(:last-child) {
    margin-bottom: 2rem;
  }
  > *:last-child {
    margin-bottom: 0;
  }

  > h2 {
    color: var(--color-text);
    font-weight: 600;
    font-size: 1.8rem;
  }
  p {
    color: #999;
    font-size: 1.6rem;
  }
`

const TransactionHistory = styled(({ className }: { className?: string }) => {
  const addresses = useAllAccountAddresses()

  return (
    <section className={className}>
      <h1>Transaction History</h1>
      <ExtensionStatusGate unavailable={<ExtensionUnavailable />}>
        <List addresses={addresses} />
      </ExtensionStatusGate>
    </section>
  )
})`
  color: var(--color-text);
  width: 100%;
  max-width: 1280px;
  margin: 3rem auto;
  @media ${device.xl} {
    margin: 6rem auto;
  }
  padding: 0 2.4rem;

  .all-nft-grids > * + * {
    margin-top: 4rem;
  }
`

export default TransactionHistory
