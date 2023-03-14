import { Copy } from '@talismn/icons'
import { Text } from '@talismn/ui'
import { useCallback } from 'react'
import toast from 'react-hot-toast'

export const useToastAddressCopied = () => {
  return useCallback(
    (value: string) =>
      toast(
        <>
          <Text.Body as="div" alpha="high">
            Address copied to clipboard
          </Text.Body>
          <Text.Body as="div">{value}</Text.Body>
        </>,
        { position: 'bottom-right', icon: <Copy /> }
      ),
    []
  )
}
