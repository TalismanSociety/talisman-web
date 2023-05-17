import styled from '@emotion/styled'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

type Props = {
  className?: string
  copy?: string
  message?: string
  children?: React.ReactNode
}
export const ClickToCopy = styled(({ className, copy, message, children }: Props) => {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return

    const timeout = setTimeout(() => setCopied(false), 1000)
    return () => clearTimeout(timeout)
  }, [copied])

  const onClick = useCallback(() => {
    void (typeof copy === 'string' && navigator.clipboard.writeText(copy).then(() => setCopied(true)))
  }, [copy])

  return (
    <span className={className} style={{ cursor: typeof copy === 'string' ? 'pointer' : undefined }} onClick={onClick}>
      <AnimatePresence>
        {copied && (
          <motion.div
            className="copied"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            {message ?? 'Copied to clipboard'}
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </span>
  )
})`
  > .copied {
    position: absolute;
    transform: translate(-25%, -25%);
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-small);
    color: var(--color-mid);
    background: var(--color-background);
    padding: 1rem 2rem;
    border-radius: 999999999999rem;
  }
`
