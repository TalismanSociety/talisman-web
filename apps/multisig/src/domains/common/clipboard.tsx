import { Copy } from '@talismn/icons'
import { Text } from '@talismn/ui'
import toast from 'react-hot-toast'

export const copyToClipboard = (text: string, message: string) => {
  navigator.clipboard.writeText(text)
  toast(
    <>
      <Text.Body as="div" alpha="high">
        {message}
      </Text.Body>
    </>,
    { position: 'bottom-right', icon: <Copy /> }
  )
}
