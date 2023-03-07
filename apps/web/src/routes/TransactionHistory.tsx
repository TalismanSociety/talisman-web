import { List } from '@archetypes/Transaction'
import { PanelSection } from '@components'
import ExtensionStatusGate from '@components/ExtensionStatusGate'
import { selectedAccountsState } from '@domains/accounts/recoils'
import styled from '@emotion/styled'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'

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
  const addresses = useRecoilValue(selectedAccountsState)

  return (
    <section className={className}>
      <ExtensionStatusGate unavailable={<ExtensionUnavailable />}>
        <List addresses={useMemo(() => addresses.map(x => x.address), [addresses])} />
      </ExtensionStatusGate>
    </section>
  )
})`
  color: var(--color-text);
  width: 100%;

  .all-nft-grids > * + * {
    margin-top: 4rem;
  }
`

export default TransactionHistory
