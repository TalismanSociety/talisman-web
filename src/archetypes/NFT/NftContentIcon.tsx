import NFT3DIcon from '@assets/icons/NFT-3D-icon.svg'
// import { ReactComponent as PlayCircleIcon } from './play-circle.svg'
// Icons Import
import NFTAudioIcon from '@assets/icons/NFT-Audio-icon.svg'
import NFTPDFIcon from '@assets/icons/NFT-PDF-icon.svg'
import NFTVideoIcon from '@assets/icons/NFT-Video-icon.svg'
import { NFTCategory } from '@libs/@talisman-nft/types'
import styled from 'styled-components'

function NftContentIcon({ type, className }: { type: NFTCategory; className?: string }) {
  switch (type) {
    case 'audio':
      return <img src={NFTAudioIcon} className={className} title="Audio" alt="Audio NFT" />
    case 'video':
      return <img src={NFTVideoIcon} className={className} title="Video" alt="Video NFT" />
    case 'model':
      return <img src={NFT3DIcon} className={className} title="3D Model" alt="3D NFT" />
    case 'application':
    case 'pdf':
      return <img src={NFTPDFIcon} className={className} title="PDF / Application" alt="PDF NFT" />
    default:
      return null
  }
}

const StyledNFTContentIcon = styled(NftContentIcon)`
  color: #a5a5a5;
  width: 1.3em;
  height: 1.3em;
`

export default StyledNFTContentIcon
