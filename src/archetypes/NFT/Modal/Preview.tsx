import '@google/model-viewer'

import CircularProgressIndicator from '@components/atoms/CircularProgressIndicator'
import { Box, File, Image, Unknown, Video, Volume2 } from '@components/atoms/Icon'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { getNFTType } from '@libs/@talisman-nft'
import { NFTDetail } from '@libs/@talisman-nft/types'
import { useEffect, useMemo, useState } from 'react'

import PlaceholderPreview from '../PlaceholderPreview'

type PreviewType = {
  className?: string
  nft?: NFTDetail
  loading: boolean
}

const MediaPreview = ({ mediaUri, thumb, type, name, id }: NFTDetail) => {
  const [fetchedType, setFetchedType] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!fetchedType) {
      setIsLoading(true)
      getNFTType(mediaUri).then(type => {
        setFetchedType(type)
      })
      setIsLoading(false)
    }
  }, [fetchedType, mediaUri])

  const effectiveType = useMemo(() => {
    if (type) return type
    if (isLoading) return 'loading'
    return fetchedType ?? undefined
  }, [type, isLoading, fetchedType])

  switch (effectiveType) {
    case 'image':
      if (!mediaUri) return <PlaceholderPreview icon={<Image />} text={'Image'} />
      return <img loading="lazy" src={mediaUri} alt={name ?? id} />
    case 'video':
      if (!mediaUri) return <PlaceholderPreview icon={<Video />} text={'Video'} />
      return <video src={mediaUri} loop muted playsInline preload="metadata" controls={true} />
    case 'pdf':
    case 'application':
      if (!mediaUri) return <PlaceholderPreview icon={<File />} text={'File'} />
      return <embed src={`${mediaUri}#toolbar=0`} />
    case 'audio':
      return (
        <>
          {thumb ? (
            <img loading="lazy" alt={name ?? id} src={thumb ?? ''} />
          ) : (
            <PlaceholderPreview icon={<Volume2 />} text={'Audio'} />
          )}
          <audio
            controls
            style={{
              position: 'absolute',
              bottom: '0px',
              width: '100%',
            }}
          >
            <source src={mediaUri} />
          </audio>
        </>
      )
    case 'model':
      if (!mediaUri) return <PlaceholderPreview icon={<Box />} text={'Model'} />
      const modelProps = {
        'src': mediaUri,
        'alt': name ?? id,
        'autoplay': 'true',
        'camera-controls': 'true',
        'shadow-intensity': '1',
        'ar-status': 'not-presenting',
      }
      return <model-viewer {...modelProps} />
    default:
      return <PlaceholderPreview icon={<Unknown />} text={'Unknown'} />
  }
}

const Preview = ({ className, nft, loading }: PreviewType) => {
  if (loading) {
    return (
      <section
        className={className}
        css={css`
          > * {
            // center
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            height: 20% !important;
            width: 20% !important;
          }
        `}
      >
        <CircularProgressIndicator size={12} />
      </section>
    )
  }

  return <section className={className}>{!!nft && <MediaPreview {...nft} />}</section>
}

const StyledPreview = styled(Preview)`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background-color: transparent;
  background-color: var(--color-dark);

  > * {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

export default StyledPreview
