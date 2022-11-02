import AlertDialog from '@components/molecules/AlertDialog'
import styled from '@emotion/styled'
import { NFTShort } from '@libs/@talisman-nft/types'
import { useState } from 'react'

import Modal from '../Modal/Modal'
import Info from './Info'
import Preview from './Preview'
import { NFTIcon } from '..'

interface CardProps {
  className?: string
  nft: NFTShort
}

function Card({ className, nft }: CardProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      {open && (
        <AlertDialog
          open={true}
          content={<Modal id={nft.id} />}
          onRequestDismiss={() => setOpen(false)}
          css={{ maxWidth: '1280px', padding: '3.2rem 3.2rem 0 3.2rem' }}
        />
      )}
      <div className={className} onClick={() => setOpen(true)}>
        <Preview nft={nft} />
        <div className="abc">
          <Info subtitle={nft?.collection?.name ?? nft?.provider} title={nft?.name ?? nft?.id} className={undefined} />
          <span>
            <NFTIcon type={nft?.type} />
          </span>
        </div>
      </div>
    </>
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
