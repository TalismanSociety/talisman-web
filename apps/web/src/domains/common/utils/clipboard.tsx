import { Copy } from '@talismn/icons'
import { Text, toast } from '@talismn/ui'

export const copyAddressToClipboard = async (address: string) => {
  await navigator.clipboard.writeText(address)
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

export const copyExtrinsicHashToClipboard = async (hash: string) => {
  await navigator.clipboard.writeText(hash)
  toast(
    <>
      <Text.Body as="div" alpha="high">
        Extrinsic hash copied to clipboard
      </Text.Body>
      <Text.Body as="div">{hash}</Text.Body>
    </>,
    { icon: <Copy /> }
  )
}
