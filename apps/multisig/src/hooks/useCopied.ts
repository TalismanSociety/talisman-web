import { useCallback, useEffect, useState } from 'react'
import { copyToClipboard } from '../domains/common'

const useCopied = (duration = 1000) => {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    (text: string, toast: string) => {
      if (copied) return
      copyToClipboard(text, toast)
      setCopied(true)
    },
    [copied]
  )

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, duration)
    }
  }, [copied, duration])

  return { copied, copy }
}

export default useCopied
