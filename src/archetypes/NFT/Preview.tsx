import '@google/model-viewer'

// Placeholders
import PDFPlaceholder from '@assets/pdf-generic.png'

import { NFTItem } from "@libs/@talisman-nft/types"
import styled from 'styled-components'

type PreviewType = {
  className?: string
  nft: NFTItem
}

const MediaPreview = (props: NFTItem) => {

  const { mediaUri, thumb, type, name, id } = props

  if (thumb) return <img loading="lazy" src={thumb} alt={name || id} />

  switch(type){
    case 'image':
      return <img loading="lazy" src={mediaUri} alt={name || id} />
    case 'video':
      return <video 
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
    case 'application':
      return <img loading="lazy" alt={name || id} src={PDFPlaceholder} />
    case 'audio':
      return <div></div>
    case 'model':
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
    default:
      return <div></div>
  }

}


const Preview = ({className, nft} : PreviewType) => {
  
  return (
    <header className={className}>
      <MediaPreview
        {...nft}
      />
    </header>
  )
}

const StyledPreview = styled(Preview)`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background-color: #333;

  > * {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`

export default StyledPreview