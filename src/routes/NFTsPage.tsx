
import { useState } from 'react'
import { NFT, Account } from '@archetypes'
import styled from 'styled-components'
import { device } from '@util/breakpoints'
import { ExtensionStatusGate, PanelSection } from '@components'
import { useTranslation } from 'react-i18next'

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

const NFTsPage = styled(({ className }: any) => {

  const [address, setAddress] = useState<string|undefined>()

  return (
    <section className={className}>
      <h1>NFTs</h1>
      <ExtensionStatusGate unavailable={<ExtensionUnavailable />}>
      <header>
        <Account.Picker 
          onChange={({address}: any) => setAddress(address)}
        />
      </header>
      <article>
        <NFT.List address={address}/>
      </article>
      </ExtensionStatusGate>
    </section>
  )
})`
  width: 100%;
  max-width: 1280px;
  margin: 3rem auto;
  @media ${device.xl} {
    margin: 6rem auto;
  }
  padding: 0 2.4rem;
  > header + article {
    margin-top: 2rem;
  }
`

export default NFTsPage

