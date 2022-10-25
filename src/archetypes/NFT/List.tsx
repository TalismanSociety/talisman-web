import { useModal } from '@components'
import styled from '@emotion/styled'
import { useNftsByAddress } from '@libs/@talisman-nft'
import { device } from '@util/breakpoints'
import { TALISMAN_SPIRIT_KEYS_RMRK } from '@util/links'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Card from './Card/Card'
import StyledLoadingCard from './Card/LoadingCard'
import Loading from './Loading'
import Modal from './Modal/Modal'

type ListPropsType = {
  className?: string
  address?: string
}

const ListItems = ({ className, nfts }: any) => {
  const { openModal } = useModal()
  const { count, isFetching, items } = nfts

  return (
    <div className={className}>
      {items.map((nft: any) => (
        <Card key={nft.id} nft={nft} onClick={() => openModal(<Modal id={nft?.id} />)} />
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
  // const { setAddress, nftData } = useNftsByAddress("0xCBf382B27fd7Ef5729EA350a68E44b83e89756f7")
  const { setAddress, nftData } = useNftsByAddress(address)
  const { t } = useTranslation('banners')

  useEffect(() => {
    setAddress(address)
    // setAddress("0xCBf382B27fd7Ef5729EA350a68E44b83e89756f7")
  }, [address, setAddress])

  return (
    <>
      <StyledListItems nfts={nftData} />
    </>
  )
}

export default List
