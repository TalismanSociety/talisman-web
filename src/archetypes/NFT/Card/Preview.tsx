import '@google/model-viewer'

import CircularProgressIndicator from '@components/atoms/CircularProgressIndicator'
import { Box, File, Image, Unknown, Video, Volume2 } from '@components/atoms/Icon'
import styled from '@emotion/styled'
import { getNFTType } from '@libs/@talisman-nft'
import { NFTDetail, NFTShort } from '@libs/@talisman-nft/types'
import { useEffect, useMemo, useState } from 'react'

import PlaceholderPreview from '../PlaceholderPreview'

type PreviewType = {
  className?: string
  nft: NFTDetail | NFTShort
}

const MediaPreview = ({ mediaUri, thumb, type, name, id }: NFTDetail | NFTShort) => {
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
      return mediaUri ? (
        <img loading="lazy" src={mediaUri} alt="" />
      ) : (
        <PlaceholderPreview icon={<Image />} text={'Image'} />
      )
    case 'video':
      // if(thumb) return <img loading="lazy" src={thumb || VideoPlaceholder} alt="" />
      if (thumb)
        return thumb ? (
          <video poster={thumb}>
            <source src={thumb} />
          </video>
        ) : (
          <PlaceholderPreview icon={<Video />} text={'Video'} />
        )
      return (
        <video
          src={thumb ?? mediaUri}
          onMouseOver={event => {
            event.target.play()
          }}
          onMouseOut={event => {
            event.target.pause()
            event.target.currentTime = 0
          }}
          loop
          muted
          playsInline
          preload="metadata"
          controlsList="nodownload"
        />
      )
    case 'pdf':
    case 'application':
      return thumb ? <img loading="lazy" alt="" src={thumb} /> : <PlaceholderPreview icon={<File />} text={'PDF'} />
    case 'audio':
      return thumb ? (
        <img loading="lazy" alt="" src={thumb} />
      ) : (
        <PlaceholderPreview icon={<Volume2 />} text={'Audio'} />
      )
    case 'model':
      if (!mediaUri) return <PlaceholderPreview icon={<Box />} text={'Model'} />
      const modelProps = {
        'src': mediaUri,
        'alt': name ?? id,
        'auto-rotate': 'true',
        'autoplay': 'false',
        'shadow-intensity': '1',
        'ar-status': 'not-presenting',
        'rotation-per-second': '20deg',
      }
      return <model-viewer {...modelProps} />
    case 'loading':
      return (
        <span className="loadingArea">
          <CircularProgressIndicator />
        </span>
      )
    case undefined:
    case 'blank':
      return <></>
    default:
      return <PlaceholderPreview icon={<Unknown />} text={'Unknown'} />
  }
}

const Preview = ({ className, nft }: PreviewType) => {
  return (
    <header className={className}>
      <MediaPreview {...nft} />
    </header>
  )
}

const StyledPreview = styled(Preview)`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background-color: #191919;

  .loadingArea {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

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

export default StyledPreview
