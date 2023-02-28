import styled from '@emotion/styled'
import { NFTCategory } from '@libs/@talisman-nft/types'
import { Icon } from '@talismn/ui'

const NftContentIcon = ({ type, className }: { type: NFTCategory; className?: string }) => {
  switch (type) {
    case 'audio':
      return <Icon.Volume2 />
    case 'video':
      return <Icon.Video />
    case 'model':
      return <Icon.Box />
    case 'application':
    case 'pdf':
      return <Icon.File />
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
