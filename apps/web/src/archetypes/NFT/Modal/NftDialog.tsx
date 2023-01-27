import Button from '@components/atoms/Button'
import Dialog, { DialogProps } from '@components/atoms/Dialog'
import { ExternalLink, Layers, X } from '@components/atoms/Icon'
import Text from '@components/atoms/Text'
import InfoWithHeader from '@components/molecules/InfoWithHeader/InfoWithHeader'
import Pill from '@components/molecules/Pill'
import { NFTPreview } from '@components/recipes/NFTPreview'
import { keyframes } from '@emotion/react'
import { useNftById } from '@libs/@talisman-nft'
import { NFTShort } from '@libs/@talisman-nft/types'

import { NFTChild } from '../types'
import InfoSkeleton from './InfoSkeleton'

export type NftDialogProps = DialogProps & {
  nft: NFTShort
  open?: boolean
  onRequestDismiss: () => void
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
          'position': 'absolute',
          'top': '2.8rem',
          'right': '4.5rem',
          'zIndex': 999,
          '@media (max-width: 1024px)': {
            position: 'fixed',
          },
        }}
      >
        <X width="24px" height="24px" />
      </Button>
      <div
        css={{
          'display': 'flex',
          'flexDirection': 'row',
          'justifyContent': 'space-between',
          '@media (max-width: 1024px)': {
            flexDirection: 'column',
            overflow: 'hidden',
          },
        }}
      >
        {/* Preview Section */}
        <section
          css={{
            'width': '50rem',
            'height': '50rem',
            'display': 'flex',
            'flexDirection': 'column',
            'justifyContent': 'center',
            'alignItems': 'center',
            'backgroundColor': 'var(--color-background)',
            '@media (max-width: 1024px)': {
              width: '100%',
            },
            '> *': {
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            },
          }}
        >
          <NFTPreview nft={nft} loading={loading} isFull />
        </section>

        {/* Details Section */}
        <section
          css={{
            'width': '100%',
            'maxHeight': '50rem',
            'overflowY': 'scroll',
            'maxWidth': 'calc(100% - 50rem)',
            'display': 'flex',
            'flexDirection': 'column',
            'padding': '2rem 3rem',
            'transition': 'height .5s ease',
            '> *': {
              marginBottom: '2rem',
            },
            '@media (max-width: 1024px)': {
              maxWidth: '100%',
              maxHeight: '100%',
              // width: '50rem',
              // height: '50rem',
            },
          }}
        >
          {loading ? (
            <InfoSkeleton />
          ) : (
            <>
              {/* Main Details */}
              <InfoWithHeader
                header={nft?.collection?.name ?? nft?.provider ?? 'Unknown'}
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
                    maxWidth: '478px',
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
                  }}
                >
                  {nft?.attributes['Migrated from'] ? (
                    <Text.Body css={{ color: '#d2fb5b' }}>Migrated NFT</Text.Body>
                  ) : (
                    Object.keys(nft?.attributes)?.map((attribute: any) => (
                      <Pill
                        key={attribute}
                        header={
                          nft?.nftSpecificData?.isEvm
                            ? nft?.attributes[attribute]?.trait_type
                            : attribute.replace('_', ' ')
                        }
                        content={
                          <Text.Body css={{ fontSize: '14px', color: '#FAFAFA' }}>
                            {typeof nft?.attributes[attribute]?.value == 'string'
                              ? nft?.attributes[attribute]?.value
                              : 'Unknown'}
                          </Text.Body>
                        }
                      />
                    ))
                  )}
                </div>
              )}
              {nft?.nftSpecificData?.children?.length > 0 && (
                <div
                  css={{
                    display: 'flex',
                    flexDirection: 'row',
                    maxWidth: '480px',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  {nft?.nftSpecificData?.children?.map((child: NFTChild) => (
                    <div
                      css={{
                        'width': '6rem',
                        'height': '6rem',
                        'borderRadius': '1rem',
                        'backgroundColor': 'rgb(8,8,8)',
                        'border': '1px transparent solid',
                        ':hover': {
                          border: '1px solid #FFFFFF',
                          cursor: 'help',
                        },
                        'transition': 'all .2s ease-in-out',
                      }}
                      title={`${child.name} #${child.serialNumber}`}
                    >
                      <img
                        src={child?.mediaUri}
                        alt={child.name}
                        css={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '1rem',
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              <section
                css={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  gap: '1.5em',
                }}
              >
                <InfoWithHeader
                  header="Network"
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
                    header="Floor Price"
                    content={
                      <span css={{ color: '#fff' }}>
                        {nft?.collection?.floorPrice} {nft?.tokenCurrency}
                      </span>
                    }
                  />
                )}
                {nft?.serialNumber && (
                  <InfoWithHeader
                    header="Edition"
                    content={
                      <span css={{ color: '#fff' }}>
                        #{!isNaN(parseInt(nft?.serialNumber)) ? nft?.serialNumber : '-'}
                        {nft?.collection?.totalCount && (
                          <span css={{ color: '#A5A5A5' }}> / {nft?.collection?.totalCount}</span>
                        )}
                      </span>
                    }
                  />
                )}
              </section>
            </>
          )}
        </section>
      </div>
    </Dialog>
  )
}

export default NftDialog
