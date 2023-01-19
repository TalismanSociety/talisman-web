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
