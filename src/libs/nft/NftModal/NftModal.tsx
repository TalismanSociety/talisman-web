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

const NftInformation = styled(({ className, nftData, nftCollectionStats }) => {
  return (
    <div className={className}>
      <NftMainDetails name={nftData?.name} collection={nftData?.collection} />
      <NftCollectionData
        editionData={nftCollectionStats?.totalNFTs}
        nftId={nftData.id}
        price={nftCollectionStats?.floor}
      />
      <NftDescription description={nftData?.description} />
      <NftAttributes properties={nftData?.properties} />
      {/* <NftNetwork network={"RMRK2"}/> */}
      <NftButtons collectibleUrl={nftData?.collectibleUrl} />
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
    font-size: 1.5em;
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
  const nftData = useNftAsset(nft)
  const nftCollectionData = useNftCollectionStats(nft)

  return (
    <div className={className}>
      <NftFullView nft={nft} />
      <Suspense fallback={null}>
        <NftInformation nftData={nftData} 
        nftCollectionStats={nftCollectionData.collectionData} 
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
