import { ToastMessage, toast } from '@talismn/ui'
import { Copy } from '@talismn/web-icons'

export const copyAddressToClipboard = async (address: string) => {
  await navigator.clipboard.writeText(address)
  toast(<ToastMessage headlineContent="Address copied to clipboard" supportingContent={address} />, { icon: <Copy /> })
}

export const copyExtrinsicHashToClipboard = async (hash: string) => {
  await navigator.clipboard.writeText(hash)
  toast(<ToastMessage headlineContent="Extrinsic hash copied to clipboard" supportingContent={hash} />, {
    icon: <Copy />,
  })
}
