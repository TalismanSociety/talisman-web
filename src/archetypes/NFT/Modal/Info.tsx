import Button from '@components/atoms/Button'
import { ChevronDown, ChevronUp } from '@components/atoms/Icon'
import Text from '@components/atoms/Text'
import styled from '@emotion/styled'
import { NFTDetail } from '@libs/@talisman-nft/types'
import { ReactNode, useEffect, useRef, useState } from 'react'

import { LoadingState } from './LoadingState'

type ExpandableProps = {
  content: ReactNode
  height: number
}

// Expandable component with a ReactNode content inside and a read more button, taking the height from props
const Expandable = ({ content, height }: ExpandableProps) => {
  const [open, setOpen] = useState(false)
  const [contentHeight, setHeight] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    setHeight(ref.current.clientHeight)
  }, [ref])

  return (
    <div
      css={{
        width: '100%',
      }}
    >
      <div
        css={{
          maxHeight: open ? '100%' : height,
          width: '100%',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          // padding: "0.75em",
          backgroundColor: 'transparent',
          borderRadius: contentHeight > height ? '0.5rem 0.5rem 0 0' : '0.5rem',
          marginBottom: '0',
        }}
      >
        <div ref={ref}>{content}</div>
      </div>
      <Button
        css={{
          display: contentHeight > height ? 'block' : 'none',
          margin: 'auto',
          width: '100%',
          padding: '0.25em',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '0 0 0.5em 0.5em',
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out',
        }}
        onClick={() => setOpen(!open)}
      >
        <Text
          css={{
            color: 'var(--color-text)',
            fontSize: '0.75em',
            fontWeight: 'bold',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          {open ? <ChevronUp /> : <ChevronDown />}
        </Text>
      </Button>
    </div>
  )
}

type InfoPieceProps = {
  title: string
  content: ReactNode
}

const InfoPiece = (props: InfoPieceProps) => {
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
      }}
    >
      <Text.Body css={{ marginBottom: '.25em' }}>{props.title}</Text.Body>
      {props.content}
    </div>
  )
}

const Pill = (props: any) => {
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '.75em',
        borderRadius: '.5em',
        backgroundColor: '#262626',
        color: '#fff',
      }}
    >
      <Text.Body
        css={{
          fontSize: '0.5em',
          marginBottom: '.25em',
        }}
      >
        {props.title}
      </Text.Body>
      <Text.Body
        css={{
          color: '#fff',
        }}
      >
        {props.text}
      </Text.Body>
    </div>
  )
}

const DetailsSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
  max-height: 452px;
  padding: 0 2em;
  gap: 1em;

  transition: all 0.3s ease-in-out;
  > :last-child {
    margin-top: auto;
  }
`

type InfoProps = {
  nft: NFTDetail
  loading: boolean
}

const Info = ({ nft, loading }: InfoProps) => {
  if (loading) return <LoadingState />

  return (
    <DetailsSection>
      {nft?.serialNumber && (
        <InfoPiece
          title="Edition"
          content={
            <Text.H3
              css={{
                marginBottom: 0,
              }}
            >
              # {nft?.serialNumber} / <span css={{ color: 'var(--color-dim)' }}>{nft?.collection?.totalCount}</span>
            </Text.H3>
          }
        />
      )}
      {nft?.description && <Expandable content={<Text.Body>{nft?.description}</Text.Body>} height={65} />}
      {nft?.attributes && (
        <div
          css={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '.5em',
          }}
        >
          {nft?.attributes['Migrated from'] ? (
            <Text.Body css={{ color: '#d2fb5b' }}>Migrated NFT</Text.Body>
          ) : (
            Object.keys(nft?.attributes).map(attribute => (
              <Pill
                key={attribute}
                title={attribute.replace('_', ' ').toUpperCase()}
                text={nft?.attributes[attribute].value}
              />
            ))
          )}
        </div>
      )}

      <div
        css={{
          width: '100%',
        }}
      >
        <InfoPiece title="Network" content={<Text.H4>{nft?.provider}</Text.H4>} />

        <Button
          css={{
            width: '100%',
          }}
          onClick={() => {
            window.open(nft?.platformUri, '_blank', 'noopener,noreferrer')
          }}
        >
          View on {nft?.provider}
        </Button>
      </div>
    </DetailsSection>
  )
}

export default Info
