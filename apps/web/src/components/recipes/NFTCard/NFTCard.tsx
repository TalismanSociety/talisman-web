import { NFTIcon } from '@archetypes/NFT'
import NftDialog from '@archetypes/NFT/Modal/NftDialog'
import styled from '@emotion/styled'
import { type NFTShort } from '@libs/@talisman-nft/types'
import { Text } from '@talismn/ui'
import { useState } from 'react'

import { NFTPreview } from '../NFTPreview'

type NFTCardProps = {
  nft?: NFTShort
  loading?: boolean
  isBlank?: boolean
}

const NFTCard = ({ nft, loading, isBlank = false }: NFTCardProps) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {nft && (
        <NftDialog
          nft={nft}
          open={open}
          onRequestDismiss={() => {
            setOpen(false)
          }}
        />
      )}
      <Card
        onClick={() => setOpen(true)}
        css={{
          cursor: nft ? 'pointer' : 'default',
        }}
      >
        <UpperSection>
          <NFTPreview nft={nft} loading={loading} isFull={false} isBlank={isBlank} />
        </UpperSection>
        <LowerSection>
          {(isBlank || loading) && !nft ? (
            <Info>
              <Text.Body
                css={{
                  marginBottom: '.5em',
                  backgroundColor: '#222',
                  fontSize: '1.4rem',
                  color: '#222',
                  borderRadius: '0.2em',
                  width: '8em',
                }}
              >
                Blank
              </Text.Body>
              <Text.H4 css={{ margin: 0, backgroundColor: '#222', color: '#222', borderRadius: '0.2em' }}>
                Blank Collection
              </Text.H4>
            </Info>
          ) : (
            <Info>
              <Text.Body
                css={{ marginBottom: '.5em', textOverflow: 'ellipsis', overflow: 'hidden', fontSize: '1.4rem' }}
              >
                {nft?.collection?.name ?? nft?.provider}
              </Text.Body>
              <Text.H4 css={{ margin: 0, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {nft?.name ?? nft?.id}
              </Text.H4>
            </Info>
          )}
          {nft ? <NFTIcon type={nft?.type} /> : undefined}
        </LowerSection>
      </Card>
    </>
  )
}

const Card = styled.div`
  overflow: hidden;
  border-radius: 1rem;
  background-color: #1e1e1e;

  transition: all 0.2s ease-in-out;

  :hover {
    box-shadow: 0 0 0 1.2px rgb(90, 90, 90);
    transform: scale(1.01);
    transition: all 0.1s ease-in-out;
  }
`

const UpperSection = styled.section`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background-color: #191919;
  > img {
    text-align: center;
  }

  > * {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`

const LowerSection = styled.section`
  display: flex;
  flex-direction: row;
  padding: 1.25rem 1.5rem;
  justify-content: space-between;
  align-items: center;
  > :last-child {
    flex: 1;
  }
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 5;
  padding-right: 1rem;
`

export default NFTCard
