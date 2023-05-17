import styled from '@emotion/styled'
import { type NFTCategory } from '@libs/@talisman-nft/types'
import { Box, File, Video, Volume2 } from '@talismn/icons'

const NftContentIcon = ({ type }: { type: NFTCategory; className?: string }) => {
  switch (type) {
    case 'audio':
      return <Volume2 />
    case 'video':
      return <Video />
    case 'model':
      return <Box />
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
