import '@talisman-connect/nft/nft.esm.css'

import { ReactComponent as ArrowRight } from '@icons/arrow-right.svg'
import { useAccountAddresses } from '@libs/talisman'
import { NftCard, useNftsByAddress } from '@talisman-connect/nft'
import { device } from '@util/breakpoints'
import { Key } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const NFTs = styled(({ className }: { className?: string }) => {
  const { t } = useTranslation()
  const addresses = useAccountAddresses()
  const { nfts } = useNftsByAddress(addresses?.[0] as string)
  return (
    <section className={`wallet-assets ${className}`}>
      <div className="header">
        <h1>{t('NFTs')}</h1>
        <NavLink to="/nfts">
          <span className="view-all">
            {t('View all')}
            <ArrowRight />
          </span>
        </NavLink>
      </div>
      <div className="nft-grid">
        {nfts?.map((nft: { id: Key | null | undefined }) => {
          return <NftCard key={nft.id} nft={nft} />
        })}
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
