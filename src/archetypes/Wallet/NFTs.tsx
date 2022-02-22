import '@talisman-connect/nft/nft.esm.css'

import { Panel, PanelSection, Pendor } from '@components'
import AllNFTs from '@components/AllNFTs'
import { ReactComponent as ArrowRight } from '@icons/arrow-right.svg'
import { useAllAccountAddresses } from '@libs/talisman'
import { device } from '@util/breakpoints'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const NFTs = styled(({ className }: { className?: string }) => {
  const { t } = useTranslation()
  const { t: tNav } = useTranslation('nav')
  const addresses = useAllAccountAddresses()
  if (!addresses?.length) {
    return (
      <section className={`wallet-assets ${className}`}>
        <Panel title={tNav('NFTs')}>
          <PanelSection comingSoon>
            <div>{t('Connect wallet')}</div>
            <Pendor />
          </PanelSection>
        </Panel>
      </section>
    )
  }
  return (
    <section className={`wallet-assets ${className}`}>
      <div className="header">
        <h1>{tNav('NFTs')}</h1>
        <NavLink to="/nfts">
          <span className="view-all">
            {t('View all')}
            <ArrowRight />
          </span>
        </NavLink>
      </div>
      <div className="nft-grid">
        <AllNFTs />
      </div>
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
    grid-template-columns: 1fr 1fr;

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
`

export default NFTs
