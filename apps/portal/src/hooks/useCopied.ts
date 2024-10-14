import { useCallback, useState } from 'react'

export const useCopied = (timeout = 2000) => {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    (text: string) => {
      window.navigator.clipboard.writeText(text)
      setCopied(true)
      // clear previous timeout id
      if (timeoutId) clearTimeout(timeoutId)
      const id = setTimeout(() => {
        setCopied(false)
        setTimeoutId(undefined)
      }, timeout)
      setTimeoutId(id)
    },
    [timeout, timeoutId]
  )

  return { copy, copied }
}
