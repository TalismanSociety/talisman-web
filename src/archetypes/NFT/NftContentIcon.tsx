import NFT3DIcon from '@assets/icons/NFT-3D-icon.svg'
// import { ReactComponent as PlayCircleIcon } from './play-circle.svg'
// Icons Import
import NFTAudioIcon from '@assets/icons/NFT-Audio-icon.svg'
import NFTPDFIcon from '@assets/icons/NFT-PDF-icon.svg'
import NFTVideoIcon from '@assets/icons/NFT-Video-icon.svg'
import { Volume2 as Audio, File, Box as Model, Video } from '@components/atoms/Icon'
import styled from '@emotion/styled'
import { NFTCategory } from '@libs/@talisman-nft/types'

const NftContentIcon = ({ type, className }: { type: NFTCategory; className?: string }) => {
  switch (type) {
    case 'audio':
      return <Audio />
    case 'video':
      return <Video />
    case 'model':
      return <Model />
    case 'application':
    case 'pdf':
      return <File />
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
