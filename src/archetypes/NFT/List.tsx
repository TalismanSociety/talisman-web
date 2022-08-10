import { useModal } from '@components'
import { useNftsByAddress } from '@libs/@talisman-nft'
import { device } from '@util/breakpoints'
import { TALISMAN_SPIRIT_KEYS_RMRK } from '@util/links'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import Card from './Card/Card'
import Loading from './Loading'
import Modal from './Modal/Modal'

type ListPropsType = {
  className?: string
  address?: string
}

const ListItems = ({ className, nfts }: any) => {
  // Create a type

  const { openModal } = useModal()

  return (
    <div className={className}>
      {nfts.map((nft: any) => (
        <Card key={nft.id} nft={nft} onClick={() => openModal(<Modal id={nft?.id} />)} />
      ))}
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

  const { setAddress, loading, nfts } = useNftsByAddress(address)


  const { t } = useTranslation('banners')

  useEffect(() => {
    setAddress(address)
  }, [address, setAddress])


  return !!loading ? (
    <Loading isLoading={true} />
  ) : !!nfts.length ? (
    <StyledListItems nfts={nfts} />
  ) : (
    <Loading
      isLoading={false}
      title={t('noNfts.description')}
      button={{ href: TALISMAN_SPIRIT_KEYS_RMRK, text: t('noNfts.primaryCta') }}
    />
  )
}

export default List
