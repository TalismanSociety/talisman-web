import '@google/model-viewer'

import AudioPlaceholder from '@assets/generic-audio.png'
import ImagePlaceholder from '@assets/generic-image.png'
import ModelPlaceholder from '@assets/generic-model.png'
// Placeholders
import PDFPlaceholder from '@assets/generic-pdf.png'
import UnknownPlaceholder from '@assets/generic-unknown.png'
import VideoPlaceholder from '@assets/generic-video.png'
import { NFTDetail } from '@libs/@talisman-nft/types'
import styled from 'styled-components'

type PreviewType = {
  className?: string
  nft?: NFTDetail
}

const MediaPreview = ({ mediaUri, thumb, type, name, id }: NFTDetail) => {

  switch (type) {
    case 'image':
      return <img loading="lazy" src={mediaUri || ImagePlaceholder} alt={name || id} />
    case 'video':
      if (!mediaUri) return <img loading="lazy" src={VideoPlaceholder} alt={name || id} />
      return <video src={mediaUri} loop muted playsInline preload="metadata" controls={true} />
    case 'pdf':
    case 'application':
      if (!mediaUri) return <img loading="lazy" alt={name || id} src={PDFPlaceholder} />
      return <embed src={`${mediaUri}#toolbar=0`} />
    case 'audio':
      return (
        <>
          <img loading="lazy" alt={name || id} src={thumb || AudioPlaceholder} />
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
      if (!mediaUri) return <img loading="lazy" alt={name || id} src={ModelPlaceholder} />
      const modelProps = {
        'src': mediaUri,
        'alt': name || id,
        'autoplay': 'true',
        'camera-controls': 'true',
        'shadow-intensity': '1',
        'ar-status': 'not-presenting',
      }
      return <model-viewer {...modelProps} />
    default:
      return <img loading="lazy" alt={name || id} src={UnknownPlaceholder} />
  }
}

const Preview = ({ className, nft }: PreviewType) => {
  return <section className={className}>{!!nft && <MediaPreview {...nft} />}</section>
}

const StyledPreview = styled(Preview)`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background-color: transparent;
  background-color: rgb(22, 22, 22);

  > * {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

export default StyledPreview
