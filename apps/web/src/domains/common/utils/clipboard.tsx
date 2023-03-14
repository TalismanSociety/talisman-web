import { Copy } from '@talismn/icons'
import { Text } from '@talismn/ui'
import toast from 'react-hot-toast'

export const copyAddressToClipboard = (address: string) => {
  navigator.clipboard.writeText(address)
  toast(
    <>
      <Text.Body as="div" alpha="high">
        Address copied to clipboard
      </Text.Body>
      <Text.Body as="div">{address}</Text.Body>
    </>,
    { position: 'bottom-right', icon: <Copy /> }
  )
}
