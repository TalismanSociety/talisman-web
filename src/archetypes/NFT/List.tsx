import styled from '@emotion/styled'
import { useNftsByAddress } from '@libs/@talisman-nft'
import { device } from '@util/breakpoints'
import { useEffect } from 'react'

import Card from './Card/Card'
import BlankCard from './Card/LoadingCard'

type ListPropsType = {
  className?: string
  address?: string
}

const ListItems = ({ className, nfts, address }: any) => {
  const { count, isFetching, items } = nfts

  const filterItemsByAddress = (items: any) => {
    return items.filter((item: any) => item.address === address)
  }

  return (
    <div className={className}>
      {filterItemsByAddress(items).map((nft: any) => (
        <Card key={nft.id} nft={nft} />
      ))}

      {items.length !== count &&
        Array.from({ length: count - items.length }).map((_, index) => <BlankCard isLoading={true} />)}

      {isFetching && <BlankCard opacity="50%" isLoading={true} />}

      {!isFetching && !filterItemsByAddress(items).length && (
        <></>
        // Create an empty array of 4 and map it
      )}
    </div>
  )
}

const StyledListItems = styled(ListItems)`
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

const List = ({ address }: ListPropsType) => {
  const { setAddress, nftData } = useNftsByAddress(address)

  useEffect(() => {
    setAddress(address)
  }, [address, setAddress])

  return (
    <>
      <StyledListItems nfts={nftData} address={address} />
    </>
  )
}

export default List
