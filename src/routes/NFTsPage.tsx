import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { device } from '@util/breakpoints'
import { Account as IAccount, useExtensionAutoConnect } from '@libs/talisman'

import Identicon from '@polkadot/react-identicon'
import { useNftsByAddress } from '@talisman-components/nft'
import { NFTsGridWrapper, NFTsBySort } from '@components/NFTsBySort'
import { ExtensionStatusGate, PanelSection } from '@components'
import NFTsByAddress from '@components/NFTsByAddress'
import SortButtons from '@components/SortButtons'

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
    if(setTotalNfts === false || typeof setTotalNfts !== 'function') {
      return;
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

export enum SoryByValue {
  ACCOUNT = 'account',
  COLLECTION = 'collection'
}

const NFTsPage = styled(({ className }) => {
  const { accounts } = useExtensionAutoConnect()
  const [totalNfts, setTotalNfts] = useState<any[] | undefined>([])
  const [sortTrigger, setSortTrigger] = useState(false)
  const [sortBy, setSortBy] = useState<SoryByValue>(SoryByValue.ACCOUNT)

  const updateTotalNfts = (nfts: any) => {
    if(!nfts) return;
    setTotalNfts((prevState: any) => {
      return [...prevState, ...nfts]
    })
  }

  const setSortByAccount = () => {
    setSortBy(SoryByValue.ACCOUNT)
  }

  const setSortByCollection = () => {
    setSortBy(SoryByValue.COLLECTION)
    // this is needed to prevent the component from re-adding states during the re-render
    setSortTrigger(true);
  }

  // Once we grab all NFTs, in this case, it's an Array<{}>
  // We use this function to store them in its respective category
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
        <SortButtons
          setSortByAccount={setSortByAccount}
          setSortByCollection={setSortByCollection}
          sortBy={sortBy}
        />
        
        <div className="all-nft-grids">
          {sortBy === 'collection' && (
            <NFTsBySort sortedNfts={sortNFtsByCollection(totalNfts)} />
          )}

          {sortBy === 'account' && accounts?.map(account => (
            <NFTGrid
              key={account.address}
              account={account}
              setTotalNfts={!sortTrigger && updateTotalNfts}
            />
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
