import '@google/model-viewer'

import AudioPlaceholder from '@assets/generic-audio.png'
import ImagePlaceholder from '@assets/generic-image.png'
import ModelPlaceholder from '@assets/generic-model.png'
// Placeholders
import PDFPlaceholder from '@assets/generic-pdf.png'
import UnknownPlaceholder from '@assets/generic-unknown.png'
import VideoPlaceholder from '@assets/generic-video.png'
import { Spinner } from '@components'
import { NFTCategory, NFTDetail } from '@libs/@talisman-nft/types'
import styled from 'styled-components'

type PreviewType = {
  className?: string
  nft: NFTDetail
}

// const fetchNFTs_type = async (IPFSUrl : string) : Promise<NFTCategory> => {
//   let cat = 'unknown'

//   if(IPFSUrl !== null) {
//     cat = await fetch(IPFSUrl)
//       .then(res => {
//         const headers = res.headers.get('content-type')
//         return !headers ? cat : headers.split('/')[0]
//       })
//   }

//   return cat as NFTCategory
// }

const MediaPreview = ({ mediaUri, thumb, type, name, id }: NFTDetail) => {

  if(!type){
    type = 'image'
  }

  switch (type) {
    case 'image':
      return <img loading="lazy" src={mediaUri || ImagePlaceholder} alt={name || id} />
    case 'video':
      // if(thumb) return <img loading="lazy" src={thumb || VideoPlaceholder} alt={name || id} />
      if(thumb) return (
        <video poster={thumb}>
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
      return <img loading="lazy" src={thumb || PDFPlaceholder} alt={name || id} />
      // return <img loading="lazy" alt={name || id} src={PDFPlaceholder} />
    case 'audio':
      return <img loading="lazy" alt={name || id} src={thumb || AudioPlaceholder} />
    case 'model':
      if (!mediaUri) return <img loading="lazy" alt={name || id} src={ModelPlaceholder} />
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
      return <Spinner />
    case 'blank':
      return <></>
    default:
      return <img loading="lazy" alt={name || id} src={UnknownPlaceholder} />
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

  > * {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`

export default StyledPreview
