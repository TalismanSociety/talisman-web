import '@google/model-viewer'

import AudioPlaceholder from '@assets/generic-audio.png'
import ImagePlaceholder from '@assets/generic-image.png'
import ModelPlaceholder from '@assets/generic-model.png'
// Placeholders
import PDFPlaceholder from '@assets/generic-pdf.png'
import UnknownPlaceholder from '@assets/generic-unknown.png'
import VideoPlaceholder from '@assets/generic-video.png'
import { Spinner } from '@components'
import styled from '@emotion/styled'
import { getNFTType } from '@libs/@talisman-nft'
import { NFTDetail } from '@libs/@talisman-nft/types'
import { useEffect, useMemo, useState } from 'react'

type PreviewType = {
  className?: string
  nft: NFTDetail
}

const MediaPreview = ({ mediaUri, thumb, type, name, id }: NFTDetail) => {
  const [fetchedType, setFetchedType] = useState<string | null>()
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
    return fetchedType ?? null
  }, [type, isLoading, fetchedType])

  switch (effectiveType) {
    case 'image':
      return <img loading="lazy" src={mediaUri || ImagePlaceholder} alt="" />
    case 'video':
      // if(thumb) return <img loading="lazy" src={thumb || VideoPlaceholder} alt="" />
      if (thumb)
        return (
          <video poster={thumb || VideoPlaceholder}>
            <source src={thumb} />
          </video>
        )
      return (
        <video
          src={thumb || mediaUri}
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
      return <img loading="lazy" src={thumb || PDFPlaceholder} alt="" />
    // return <img loading="lazy" alt="" src={PDFPlaceholder} />
    case 'audio':
      return <img loading="lazy" alt="" src={thumb || AudioPlaceholder} />
    case 'model':
      if (!mediaUri) return <img loading="lazy" alt="" src={ModelPlaceholder} />
      const modelProps = {
        'src': mediaUri,
        'alt': name || id,
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
          <Spinner />
        </span>
      )
    case null:
    case 'blank':
      return <></>
    default:
      return <img loading="lazy" alt="" src={UnknownPlaceholder} />
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
  background-color: #333;

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
