import { NftCard } from '@talisman-components/nft'
import { device } from '@util/breakpoints'
import styled from 'styled-components'

const NFTsGridWrapper = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
  margin-bottom: 3rem;

  @media ${device.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${device.lg} {
    grid-template-columns: repeat(3, 1fr);
  }

  @media ${device.xl} {
    grid-template-columns: repeat(4, 1fr);
  }
`

export interface NFTsBySortProps {
  sortedNfts: any[]
}

const NFTsBySort = ({ sortedNfts }: NFTsBySortProps) => {
  if (!sortedNfts) {
    return <h3>No sorted NFTs found!</h3>
  }

  console.log(typeof sortedNfts)

  const renderCollection = Object.keys(sortedNfts).sort().map((collectionName: any) => {
    return (
      <div key={collectionName}>
      <h2>{collectionName}</h2>

      <NFTsGridWrapper>
        {sortedNfts[collectionName].map((nft: any) => (
            <NftCard key={nft.id} nft={nft} />
          )
        )}
      </NFTsGridWrapper>
    </div>
    )
  })

  return (
    <div>
      {renderCollection}
    </div>
  )
}

export { NFTsGridWrapper, NFTsBySort }
