import Text from '@components/atoms/Text'
import { NFTCard } from '@components/recipes/NFTCard'
import { WalletNavConnector } from '@components/WalletNavConnector'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { GetNFTData } from '@libs/@talisman-nft'
import { NFTData } from '@libs/@talisman-nft/types'
import { device } from '@util/breakpoints'

import HiddenNFTGrid from './HiddenNFTGrid'

const ListItems = ({ nfts }: { nfts: NFTData }) => {
  const { count, isFetching, items } = nfts

  return (
    <>
      {items.map((nft: any) => (
        <NFTCard key={nft.id} nft={nft} />
      ))}

      {items.length !== count &&
        Array.from({ length: count - items.length }).map((_, index) => <NFTCard loading={true} />)}

      {isFetching && <NFTCard loading={true} />}
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

const List = ({ addresses }: { addresses: string[] }) => {
  const { items, isFetching, count } = GetNFTData({ addresses: addresses })

  if (!items.length && !isFetching && !count)
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

  // filter items by address and map listgrid per address
  // const nfts = items.reduce((acc: any, nft: any) => {
  //   if (!acc[nft?.address]) acc[nft?.address] = []
  //   acc[nft?.address].push(nft)
  //   return acc
  // }, {})

  return (
    <ListGrid>
      <ListItems
        nfts={{
          items: items,
          isFetching: isFetching,
          count: count,
        }}
      />
    </ListGrid>
  )
}

export default List
