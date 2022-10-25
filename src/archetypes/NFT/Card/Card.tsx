import styled from '@emotion/styled'
import { NFTShort } from '@libs/@talisman-nft/types'

import Info from './Info'
import Preview from './Preview'
import { NFTIcon } from '..'

interface CardProps {
  className?: string
  nft: NFTShort
  onClick: () => void
}

function Card({ className, nft, onClick }: CardProps) {
  return (
    <div className={className} onClick={onClick}>
      <Preview nft={nft} />
      <div className="abc">
        <Info subtitle={nft?.collection?.name || nft?.provider} title={nft?.name || nft?.id} />
        <span>
          <NFTIcon type={nft?.type} />
        </span>
      </div>
    </div>
  )
}

const StyledCard = styled(Card)`
  overflow: hidden;
  border-radius: 1rem;
  background-color: #262626;
  cursor: pointer;

  .abc {
    display: flex;
    justify-content: space-between;
  }

  > * {
    width: 100%;
  }

  span {
    width: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  > div {
    margin: 1rem 0;
  }
`

export default StyledCard
