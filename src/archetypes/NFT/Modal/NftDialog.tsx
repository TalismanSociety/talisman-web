import StyledPreview from '@archetypes/NFT/Modal/Preview'
import Button from '@components/atoms/Button'
import CircularProgressIndicator from '@components/atoms/CircularProgressIndicator'
import Dialog, { DialogProps } from '@components/atoms/Dialog'
import { ExternalLink, Layers, X } from '@components/atoms/Icon'
import Text from '@components/atoms/Text'
import InfoWithHeader from '@components/molecules/InfoWithHeader/InfoWithHeader'
import Pill from '@components/molecules/Pill'
import { keyframes } from '@emotion/react'
import { useNftById } from '@libs/@talisman-nft'
import { NFTDetail } from '@libs/@talisman-nft/types'

export type NftDialogProps = DialogProps & {
  nft: NFTDetail
  loading: boolean
  onRequestDismiss: () => unknown
}

const show = keyframes`
  from {
    opacity: 0;
    transform: translateY(2rem);
  }
`

const backdropKeyframes = keyframes`
  from {
    background: rgba(0,0,0,0);
    backdrop-filter: blur(0);
  }
  to {
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(16px);
  }
`

const NftDialog = (props: NftDialogProps) => {
  const { nft, loading } = useNftById(props.nft.id)

  return (
    <Dialog
      {...props}
      onClickBackdrop={props.onRequestDismiss}
      onClose={props.onRequestDismiss}
      onCancel={props.onRequestDismiss}
      css={{
        'width': '108rem',
        'maxHeight': '66rem',
        'background': '#121212',
        'padding': 0,
        'border': 'none',
        'borderRadius': '1.6rem',
        '&[open]': {
          'animation': `${show} .5s ease`,
          '::backdrop': {
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(16px)',
            animation: `${backdropKeyframes} .5s ease forwards`,
          },
        },
      }}
    >
      <Button
        variant="noop"
        onClick={props.onRequestDismiss}
        css={{
          position: 'absolute',
          top: '2.8rem',
          right: '4.5rem',
        }}
      >
        <X width="24px" height="24px" />
      </Button>
      <div
        css={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {/* Preview Section */}
        <section
          css={{
            width: '50rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'var(--color-background)',
          }}
        >
          <StyledPreview
            css={{
              width: '50rem',
              height: '50rem',
            }}
            nft={nft}
            loading={props.loading}
          />
        </section>

        {/* Details Section */}
        <section
          css={{
            width: '100%',
            maxHeight: '50rem',
            overflowY: 'scroll',
            maxWidth: 'calc(100% - 50rem)',
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem 3rem',
            transition: 'height .5s ease',
            gap: '2em',
          }}
        >
          {/* Main Details */}
          <InfoWithHeader
            headerText={nft?.collection?.name || nft?.provider}
            content={
              <Text.H3
                css={{
                  whiteSpace: 'nowrap',
                  maxWidth: '380px',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  marginBottom: '0',
                }}
              >
                {props.nft?.name}{' '}
                {!!props.nft?.nftSpecificData?.isComposable && (
                  <Layers css={{ color: 'var(--color-primary)', width: '0.75em' }} title="Composable" />
                )}
              </Text.H3>
            }
          />

          {/* Description */}
          {nft?.description && (
            <article
              css={{
                'maxWidth': '478px',
                '-webkit-box-orient': 'vertical',
                'display': '-webkit-box',
                '-webkit-line-clamp': '4',
                'overflow': 'hidden',
                'text-overflow': 'ellipsis',
                'white-space': 'normal',
              }}
            >
              <Text.Body>{nft?.description}</Text.Body>
            </article>
          )}

          {/* Attributes */}
          {nft?.attributes && (
            <div
              css={{
                maxWidth: '478px',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '.5em',
                maxHeight: '11rem',
                overflow: 'hidden',
              }}
            >
              {nft?.attributes['Migrated from'] ? (
                <Text.Body css={{ color: '#d2fb5b' }}>Migrated NFT</Text.Body>
              ) : (
                Object.keys(nft?.attributes).map(attribute => (
                  <Pill
                    key={attribute}
                    headerText={attribute.replace('_', ' ')}
                    text={nft?.attributes[attribute].value}
                  />
                ))
              )}
            </div>
          )}

          {/* Extra Details Section */}
          <section
            css={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              gap: '1.5em',
              marginTop: 'auto',
            }}
          >
            <InfoWithHeader
              headerText="Network"
              content={
                <span>
                  <a href={nft?.platformUri} target="_blank" rel="noreferrer" css={{ color: '#fff' }}>
                    {nft?.provider}
                  </a>
                  <ExternalLink height={'0.75em'} />
                </span>
              }
            />
            {nft?.collection?.floorPrice && (
              <InfoWithHeader
                headerText="Floor Price"
                content={<span css={{ color: '#fff' }}>{nft?.collection?.floorPrice}</span>}
              />
            )}
            {nft?.serialNumber && (
              <InfoWithHeader
                headerText="Edition"
                content={
                  <span css={{ color: '#fff' }}>
                    #{nft?.serialNumber}
                    {nft?.collection?.totalCount && (
                      <span css={{ color: '#A5A5A5' }}> / {nft?.collection?.totalCount}</span>
                    )}
                  </span>
                }
              />
            )}
          </section>
        </section>
      </div>
    </Dialog>
  )
}

export default NftDialog
