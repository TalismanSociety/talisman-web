import { NFTItem } from '@libs/@talisman-nft/types'
import { Info } from '@components'
import styled from 'styled-components'
import Preview from './Preview'

interface CardProps {
  className?: string
  nft: NFTItem
  onClick: () => void
}

function Card({className, nft, onClick}: CardProps) {

  return (
    <div className={className} onClick={onClick}>
      <Preview nft={nft} />
      <Info
        title={nft.name}
        subtitle={nft.name}
      />
    </div>
  )
}

const StyledCard = styled(Card)`
  overflow: hidden;
  border-radius: 1rem;
  background-color: #262626;
  cursor: pointer;

  > * {
    width: 100%;
  }

  > div {
    margin: 1rem 0;
  }
`

export default StyledCard
