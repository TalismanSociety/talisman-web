import { useNftsByAddress } from '@libs/@talisman-nft';
import { device } from '@util/breakpoints';
import { useEffect } from 'react';
import styled from 'styled-components'
import Card from './Card/Card'

import { useModal } from '@components'
import Modal from './Modal/Modal'
import { useTranslation } from 'react-i18next'

import nftRowSkeleton from '@assets/nft-row-skeleton.png'
import { Button } from '@components'
import { Placeholder } from '@components/Placeholder'
import { TALISMAN_SPIRIT_KEYS_RMRK } from '@util/links'



type ListPropsType = {
  className?: string
  address?: string
}

const ListItems = ({className, nfts}: any) => { // Create a type

  const { openModal } = useModal()


  return <div className={className}>
    {nfts.map((nft : any) => <Card key={nft.id} nft={nft} onClick={() => openModal(<Modal id={nft?.id} />)}/> )}
  </div>
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

const Loading = ({className} : any) => {
  return <div className={className}>
    ...loading
    </div>
}

const StyledLoading = styled(Loading)`
  color: red
`

const NoNFTsPlaceholder = () => {
  const { t } = useTranslation('banners')
  return (
    <Placeholder placeholderImage={nftRowSkeleton}>
      <div className="description">{t('noNfts.description')}</div>
      <div className="cta">
        <a href={TALISMAN_SPIRIT_KEYS_RMRK} target="_blank" rel="noopener noreferrer">
          <Button className="outlined">{t('noNfts.primaryCta')}</Button>
        </a>
      </div>
    </Placeholder>
  )
}


const List = ({ className, address } : ListPropsType) => {
  const {
    setAddress,
    loading,
    nfts
  } = useNftsByAddress(address)

  useEffect(() => {
    setAddress(address)
  }, [address, setAddress])
  

  return(
    !!loading 
      ? <StyledLoading />
      : !!nfts.length
        ? <StyledListItems nfts={nfts}/>
        : <NoNFTsPlaceholder />
  )
}

export default List