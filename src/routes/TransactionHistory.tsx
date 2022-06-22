import ExtensionStatusGate from '@components/ExtensionStatusGate'
import { device } from '@util/breakpoints'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { PanelSection } from '@components'
import { List } from '@archetypes/Transaction'
import { useAccountAddresses } from '@libs/talisman'
//import { useURLParams } from '@libs/txhistory'
//import { useEffect, useState } from 'react'


const ExtensionUnavailable = styled(props => {
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

const TransactionHistory = styled(({ className } : { className : string }) => {

  // URL Address is recieved first
  // then the account addresses is recieved from the wallet (Slight delay about half a second)
  // This triggers the useEffect

  const addresses = useAccountAddresses()
  // Returns an array [the selected account]

  // const [address, setAddress] = useState<string>(addresses[0])

  // useEffect(() => {
  //   setAddress(addresses[0])
  // }, [addresses])

  return (
    <section className={className}>
      <h1>Transaction History</h1>
      <ExtensionStatusGate unavailable={<ExtensionUnavailable />}>
        <List address={addresses[0]} />
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