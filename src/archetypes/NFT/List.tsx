import { useNftsByAddress } from '@libs/@talisman-nft';
import { device } from '@util/breakpoints';
import { useEffect } from 'react';
import styled from 'styled-components'
import Card from './Card/Card'

import { useModal } from '@components'
import Modal from './Modal/Modal'


type ListPropsType = {
  className?: string
  address?: string
}

const List = ({className, address}: ListPropsType) => {

  const { openModal } = useModal()

  const {
    setAddress,
    loading,
    nfts
  } = useNftsByAddress(address)

  useEffect(() => {
    setAddress(address)
  }, [address, setAddress])

  return <div className={className}>
    {!!loading
      ? <span>Loading</span> : 
      !loading && nfts.length > 0 ? nfts.map((nft : any) => <Card key={nft.id} nft={nft} onClick={() => openModal(<Modal id={nft?.id} />)}/> ) :
      <span>No NFTs</span>
    }
  </div>
}

const StyledList = styled(List)`
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

export default StyledList