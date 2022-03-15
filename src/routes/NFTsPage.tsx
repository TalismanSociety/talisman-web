import { ExtensionStatusGate, PanelSection } from '@components'
import NFTsByAddress from '@components/NFTsByAddress'
import { NFTsBySort, NFTsGridWrapper } from '@components/NFTsBySort'
import SortButtons from '@components/SortButtons'
import { Account as IAccount, useExtensionAutoConnect } from '@libs/talisman'
import Identicon from '@polkadot/react-identicon'
import { useNftsByAddress } from '@talisman-components/nft'
import { device } from '@util/breakpoints'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface AccountProps {
  className?: string
  account: IAccount
  setTotalNfts: ((value: []) => void) | boolean
}

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

const NFTGrid = styled(({ className = '', account, setTotalNfts }: AccountProps) => {
  const { address, name, type } = account
  const { nfts } = useNftsByAddress(address as string)

  useEffect(() => {
    // Needs to add check if this is a function, or else TS will be angry
    if (setTotalNfts === false || typeof setTotalNfts !== 'function') {
      return
    }
    setTotalNfts(nfts)
  }, [nfts])

  if (!nfts?.length) {
    return null
  }

  return (
    <div className={className}>
      <div className="account-name">
        <Identicon
          className="identicon"
          size={64}
          value={address}
          theme={type === 'ethereum' ? 'ethereum' : 'polkadot'}
        />
        <span>{name}</span>
      </div>
      <NFTsGridWrapper>
        <NFTsByAddress address={address} />
      </NFTsGridWrapper>
    </div>
  )
})`
  .account-name {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .identicon {
    svg {
      width: 2.5em;
      height: 2.5em;
    }

    > * {
      line-height: 0;
    }
  }
`

export type SoryByValue = 'account' | 'collection'

const NFTsPage = styled(({ className }) => {
  const { accounts } = useExtensionAutoConnect()
  const [totalNfts, setTotalNfts] = useState<any[] | undefined>([])
  const [sortTrigger, setSortTrigger] = useState(false)
  const [sortBy, setSortBy] = useState<SoryByValue>('account')

  const updateTotalNfts = (nfts: any) => {
    if (!nfts) return
    setTotalNfts((prevState: any) => {
      return [...prevState, ...nfts]
    })
  }

  // Store the collections in an object of arrays
  const sortNFtsByCollection = (nfts: any) => {
    const getAllNFtsCollections = nfts.reduce((collectionAccumlator: any, nft: any) => {
      // Get collection name
      const collectionName = nft.collection.name

      // Create a new collection if doesn't exist
      if (!collectionAccumlator[collectionName]) {
        collectionAccumlator[collectionName] = []
      }

      // If the collection exists, we store its NFT in it
      collectionAccumlator[collectionName].push(nft)
      return collectionAccumlator
    }, [])

    return getAllNFtsCollections
  }

  return (
    <section className={className}>
      <h1>NFTs</h1>
      <ExtensionStatusGate unavailable={<ExtensionUnavailable />}>
        <SortButtons sortValue={sortBy} setSortBy={setSortBy} setSortTrigger={setSortTrigger} />

        <div className="all-nft-grids">
          {sortBy === 'collection' && <NFTsBySort sortedNfts={sortNFtsByCollection(totalNfts)} />}

          {sortBy === 'account' &&
            accounts?.map(account => (
              <NFTGrid key={account.address} account={account} setTotalNfts={!sortTrigger && updateTotalNfts} />
            ))}
        </div>
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

export default NFTsPage
