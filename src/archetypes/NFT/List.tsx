import { useNftsByAddress } from '@libs/@talisman-nft/useNftsByAddress';
import { device } from '@util/breakpoints';
import { useEffect } from 'react';
import styled from 'styled-components'
import Card from './Card'

type ListPropsType = {
  className?: string
  address?: string
}

const List = ({className, address}: ListPropsType) => {

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
      ? <span>Loading</span>
      : nfts.map((nft : any) => <Card key={nft.id} nft={nft} onClick={() => {}}/> )
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