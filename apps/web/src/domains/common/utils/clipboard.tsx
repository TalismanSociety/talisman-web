import { Copy } from '@talismn/icons'
import { Text, toast } from '@talismn/ui'

export const copyAddressToClipboard = (address: string) => {
  navigator.clipboard.writeText(address)
  toast(
    <>
      <Text.Body as="div" alpha="high">
        Address copied to clipboard
      </Text.Body>
      <Text.Body as="div">{address}</Text.Body>
    </>,
    { icon: <Copy /> }
  )
}
