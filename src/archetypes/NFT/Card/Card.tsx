import NftDialog from '@archetypes/NFT/Modal/NftDialog'
import styled from '@emotion/styled'
import { NFTShort } from '@libs/@talisman-nft/types'
import { useState } from 'react'

import Info from './Info'
import Preview from './Preview'
import { NFTIcon } from '..'

interface CardProps {
  className?: string
  nft: NFTShort
}

const NFTCard = ({ className, nft }: CardProps) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <NftDialog nft={nft} open={open} onRequestDismiss={() => setOpen(false)} />
      {/* Card */}
      <Card onClick={() => setOpen(true)}>
        <Preview nft={nft} />
        <div className="abc">
          <Info subtitle={nft?.collection?.name ?? nft?.provider} title={nft?.name ?? nft?.id} className={undefined} />
          <span>
            <NFTIcon type={nft?.type} />
          </span>
        </div>
      </Card>
    </>
  )
}

const Card = styled.div`
  overflow: hidden;
  border-radius: 1rem;
  background-color: #1e1e1e;
  cursor: pointer;

  transition: all 0.2s ease-in-out;

  :hover {
    box-shadow: 0 0 0 1.2px rgb(90, 90, 90);
    transform: scale(1.01);
    transition: all 0.1s ease-in-out;
  }

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

export default NFTCard
