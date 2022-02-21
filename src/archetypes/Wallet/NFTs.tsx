import '@talisman-connect/nft/nft.esm.css'

import { useAccountAddresses } from '@libs/talisman'
import { NftCard, useNftsByAddress } from '@talisman-connect/nft'
import { Key } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const NFTs = styled(({ className }: { className?: string }) => {
  const { t } = useTranslation()
  const addresses = useAccountAddresses()
  const { nfts } = useNftsByAddress(addresses?.[0] as string)
  console.log(`>>> nts`, nfts)
  return (
    <section className={`wallet-assets ${className}`}>
      <h1>{t('NFTs')}</h1>
      <div
        style={{
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: '1fr 1fr 1fr',
        }}
      >
        {nfts?.map((nft: { id: Key | null | undefined }) => {
          return <NftCard key={nft.id} nft={nft} />
        })}
      </div>
    </section>
  )
})`
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
