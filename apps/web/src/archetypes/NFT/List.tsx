import Text from '@components/atoms/Text'
import { WalletNavConnector } from '@components/WalletNavConnector'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { useNftsByAddress } from '@libs/@talisman-nft'
import { NFTData, NFTShort } from '@libs/@talisman-nft/types'
import { device } from '@util/breakpoints'
import { useEffect } from 'react'

import Card from './Card/Card'
import BlankCard from './Card/LoadingCard'
import HiddenNFTGrid from './HiddenNFTGrid'

const ListItems = ({ nfts }: { nfts: NFTData }) => {
  const { count, isFetching, items } = nfts

  return (
    <>
      {items.map((nft: any) => (
        <Card key={nft.id} nft={nft} />
      ))}

      {items.length !== count &&
        Array.from({ length: count - items.length }).map((_, index) => <BlankCard isLoading={true} />)}

      {isFetching && <BlankCard opacity="50%" isLoading={true} />}
    </>
  )
}

const ListGrid = styled.div`
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
`

const List = ({ address }: { address: string }) => {
  const { setAddress, nftData } = useNftsByAddress(address)

  useEffect(() => {
    setAddress(address)
  }, [address, setAddress])

  const filterItemsByAddress = (nftData: NFTData) => {
    const items = nftData?.items.filter((item: NFTShort) => item.address === address)

    return {
      ...nftData,
      count: items.length,
      items: items,
    }
  }

  if (!filterItemsByAddress(nftData).items.length && !nftData.isFetching && !nftData.count)
    return (
      <HiddenNFTGrid
        overlay={
          <span
            css={css`
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              > * {
                margin-bottom: 1rem;
              }
            `}
          >
            <Text.H2>No NFTs Found</Text.H2>
            <Text.Body>Please try another account</Text.Body>
            <WalletNavConnector />
          </span>
        }
      />
    )

  return (
    <ListGrid>
      <ListItems nfts={filterItemsByAddress(nftData)} />
    </ListGrid>
  )
}

export default List
