import { NFT } from '@archetypes'
import { HiddenNFTGrid } from '@archetypes/NFT'
import { ExtensionStatusGate, PanelSection } from '@components'
import Text from '@components/atoms/Text'
import { WalletNavConnector } from '@components/WalletNavConnector'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { useActiveAccount } from '@libs/talisman'
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

const NFTsPage = styled(({ className }: any) => {
  const queryParams = new URLSearchParams(window.location.search)
  const address = queryParams.get('address') ?? useActiveAccount().address

  return (
    <section className={className}>
      <h1>NFTs</h1>
      <ExtensionStatusGate unavailable={<ExtensionUnavailable />}>
        {address ? (
          <>
            <article>
              <NFT.List address={address} />
            </article>
          </>
        ) : (
          // Add the placeholders and select one account
          <HiddenNFTGrid
            overlay={
              <span
                css={css`
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                `}
              >
                <Text.H2>Please Select an Account</Text.H2>
                <WalletNavConnector />
              </span>
            }
          />
        )}
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
    margin-top: 3rem;
  }
`

export default NFTsPage
