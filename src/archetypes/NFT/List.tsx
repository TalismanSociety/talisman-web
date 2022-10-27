import styled from '@emotion/styled'
import { useNftsByAddress } from '@libs/@talisman-nft'
import { device } from '@util/breakpoints'
import { useEffect } from 'react'

import Card from './Card/Card'
import StyledLoadingCard from './Card/LoadingCard'

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

      {items.length !== count && Array.from({ length: count - items.length }).map((_, index) => <StyledLoadingCard />)}

      {isFetching && <StyledLoadingCard />}
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
  // const { setAddress, nftData } = useNftsByAddress("0x73ae2354A270a6AFF6F84Ce84627c7ee2d5aFbcD")
  const { setAddress, nftData } = useNftsByAddress(address)

  useEffect(() => {
    setAddress(address)
    // setAddress("0x73ae2354A270a6AFF6F84Ce84627c7ee2d5aFbcD")
  }, [address, setAddress])

  return (
    <>
      <StyledListItems nfts={nftData} address={address} />
    </>
  )
}

export default List
