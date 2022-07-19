import { device } from '@util/breakpoints'
import { Suspense, useEffect } from 'react'
import styled from 'styled-components'

import NftFullView from '../NftFullView/NftFullView'
import {
  NftAttributes,
  NftButtons,
  NftCollectionData,
  NftDescription,
  NftMainDetails,
  NftNetwork,
} from '../NftFullViewInformation/NftFullViewInformation'
import useNftAsset from '../useNftAsset/useNftAsset'
import { useNftCollectionStats } from '../useNftCollectionStats/useNftCollectionStats'

const NftInformation = styled(({ className, nft }) => {
  return (
    <div className={className}>
      <NftMainDetails name={nft?.name} collection={nft?.collection?.name} />
      <NftCollectionData
        editionData={nft?.collection?.totalCount}
        nftId={nft.serialNumber}
        price={nft?.collection?.floorPrice}
      />
      <NftDescription description={nft?.description} />
      <NftAttributes properties={nft?.attributes} />
      <NftNetwork network={nft?.platform}/>
      <NftButtons collectibleUrl={nft?.id} />
    </div>
  )
})`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 458px;
  @media ${device.sm} {
    margin-left: 0;
    margin-top: 1em;
  }
  @media ${device.lg} {
    margin-left: 3em;
    margin-top: 0;
  }

  div:last-of-type {
    margin-top: auto;
  }

  p {
    margin-bottom: 0;
  }

  .nft-main-val {
    font-size: 1.4em;
    font-weight: 600;
    color: var(--color-light);
  }

  .nft-sub-val {
    font-weight: 600;
    color: var(--color-dim);
  }

  h1 {
    font-weight: 400;
    color: var(--color-mid);
    font-size: 14px;
    line-height: 16px;
    margin-bottom: 10px;
  }
`

export const NftModal = styled(({ className, nft }) => {
  // const nft = useNftAsset(nft)
  // const nftCollectionData = useNftCollectionStats(nft)

  return (
    <div className={className}>
      <NftFullView nft={nft} />
      <Suspense fallback={null}>
        <NftInformation nft={nft} 
        // nftCollectionStats={nftCollectionData.collectionData} 
        />
      </Suspense>
    </div>
  )
})`
  display: grid;

  @media ${device.sm} {
    grid-template-columns: 1fr;
    width: 100%;
  }

  @media ${device.lg} {
    grid-template-columns: 1fr 1fr;
    width: 905px;
    max-height: 1500px;
  }
`
