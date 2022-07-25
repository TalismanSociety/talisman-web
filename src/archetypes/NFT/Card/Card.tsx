import { NFTShort } from '@libs/@talisman-nft/types'
import styled from 'styled-components'

import Info from './Info'
import Preview from './Preview'

interface CardProps {
  className?: string
  nft: NFTShort
  onClick: () => void
}

function Card({ className, nft, onClick }: CardProps) {
  return (
    <div className={className} onClick={onClick}>
      <Preview nft={nft} />
      <Info
        subtitle={nft?.name || nft?.id}
        title={nft?.name || nft?.id}
        // Work on ICONS
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
