import { ExtensionStatusGate, Panel, PanelSection } from '@components'
import { ReactComponent as ArrowRight } from '@icons/arrow-right.svg'
import { NftCard } from '@libs/nft/NftCard/NftCard'
import { NoNFTsPlaceholder } from '@libs/nft/NoNFTsPlaceholder'
import { useHasNFTs } from '@libs/nft/useHasNFTs'
import { useExtensionAutoConnect } from '@libs/talisman'
import { device } from '@util/breakpoints'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const ExtensionUnavailable = styled(props => {
  const { t } = useTranslation()
  return (
    <Panel title={t('NFTs')}>
      <PanelSection comingSoon {...props}>
        <p>{t('extensionUnavailable.subtitle')}</p>
        <p>{t('extensionUnavailable.text')}</p>
      </PanelSection>
    </Panel>
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

const NFTs = styled(({ className }: { className?: string }) => {
  const { t } = useTranslation()
  const { t: tNav } = useTranslation('nav')
  const { accounts } = useExtensionAutoConnect()
  const { hasNfts, nfts } = useHasNFTs(accounts, { limit: 4 })
  return (
    <section className={`wallet-assets ${className}`}>
      <ExtensionStatusGate unavailable={<ExtensionUnavailable />}>
        <div className="header">
          <h1>{tNav('NFTs')}</h1>
          {hasNfts && (
            <NavLink to="/nfts">
              <span className="view-all">
                {t('View all')}
                <ArrowRight />
              </span>
            </NavLink>
          )}
        </div>
        {!hasNfts && <NoNFTsPlaceholder />}
        {hasNfts && (
          <div className="nft-grid">
            {nfts?.map(nft => {
              return <NftCard key={nft.id} nft={nft} />
            })}
          </div>
        )}
      </ExtensionStatusGate>
    </section>
  )
})`
  .header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .view-all {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .nft-grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr;

    @media ${device.md} {
      grid-template-columns: repeat(2, 1fr);
    }

    @media ${device.lg} {
      grid-template-columns: repeat(3, 1fr);
    }

    @media ${device.xl} {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  h1 {
    display: flex;
    align-items: baseline;
    margin-bottom: 0.8em;
    font-size: var(--font-size-large);
    font-weight: bold;
    color: var(--color-text);
  }

  .nft-grid {
    svg {
      width: 4.8rem;
      height: 4rem;
    }

    @media ${device.lg} {
      svg {
        width: 4.5rem;
        height: 4rem;
      }
    }
  }
`

export default NFTs
