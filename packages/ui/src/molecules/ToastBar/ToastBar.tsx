import { useTheme } from '@emotion/react'
import { Check, X } from '@talismn/icons'
import { formatDistanceToNowStrict } from 'date-fns'
import { motion } from 'framer-motion'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { resolveValue, type Toast, type ToastPosition } from 'react-hot-toast/headless'
import { CircularProgressIndicator, Text } from '../../atoms'

export type ToastBarProps = {
  toast: Toast
  position?: ToastPosition
}

const ToastBar = ({ toast }: ToastBarProps) => {
  const theme = useTheme()
  const [createdAtDistance, setCreatedAtDistance] = useState(
    formatDistanceToNowStrict(toast.createdAt, { addSuffix: true })
  )
  const children = resolveValue(toast.message, toast)
  const resolvedChildren = (children as any)?.type === Fragment ? (children as any)?.props?.children : children

  const [firstMessage, ...messages] = React.Children.toArray(resolvedChildren)

  useEffect(() => {
    const interval = setInterval(
      () => setCreatedAtDistance(formatDistanceToNowStrict(toast.createdAt, { addSuffix: true })),
      1000
    )

    return () => clearInterval(interval)
  }, [toast.createdAt])

  const origin = useMemo(() => {
    switch (toast.position) {
      case 'top-center':
        return { y: '-100%' }
      case 'bottom-left':
      case 'bottom-center':
      case 'bottom-right':
        return { y: '100%' }
      case 'top-right':
      case undefined:
        return { x: '100%' }
      case 'top-left':
        return { x: '-100%' }
    }
  }, [toast.position])

  return (
    <motion.div
      key={toast.id}
      css={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem',
        padding: '1.6rem',
        borderRadius: '0.8rem',
        backgroundColor: theme.color.surface,
      }}
      initial={{ ...origin, opacity: 0, scale: 0.8 }}
      animate={{ ...(toast.visible ? { x: 0, y: 0 } : origin), opacity: toast.visible ? 1 : 0, scale: 1 }}
      whileHover={{ scale: 1.01 }}
      {...toast.ariaProps}
    >
      {useMemo(() => {
        const commonCss = {
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '4rem',
          height: '4rem',
          borderRadius: '2rem',
        }

        if (toast.icon !== undefined) {
          return (
            <div
              css={{
                ...commonCss,
                backgroundColor: toast.iconTheme?.primary,
                color: toast.iconTheme?.secondary,
              }}
            >
              {resolveValue(toast.icon, toast)}
            </div>
          )
        }

        switch (toast.type) {
          case 'loading':
            return <CircularProgressIndicator size="4rem" />
          case 'success':
            return (
              <div
                css={{
                  ...commonCss,
                  backgroundColor: 'rgba(56, 212, 72, 0.25)',
                  color: '#38D448',
                }}
              >
                <Check size="2rem" />
              </div>
            )
          case 'error':
            return (
              <div
                css={{
                  ...commonCss,
                  backgroundColor: 'rgba(210, 36, 36, 0.25)',
                  color: '#D22424',
                }}
              >
                <X size="2rem" />
              </div>
            )
        }

        return undefined
      }, [toast])}
      <Text.Body as="div">
        <Text.Body css={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <span>{firstMessage}</span>
          <Text.Body alpha="disabled" css={{ textAlign: 'end', alignSelf: 'first baseline', minWidth: '11rem' }}>
            {createdAtDistance}
          </Text.Body>
        </Text.Body>
        {messages}
      </Text.Body>
    </motion.div>
  )
}

export default ToastBar
