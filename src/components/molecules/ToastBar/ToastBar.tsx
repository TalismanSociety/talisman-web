import CircularProgressIndicator from '@components/atoms/CircularProgressIndicator'
import { Check, X } from '@components/atoms/Icon'
import Text from '@components/atoms/Text'
import { useTheme } from '@emotion/react'
import { formatDistanceToNowStrict } from 'date-fns'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { Toast, resolveValue } from 'react-hot-toast'

export type ToastBarProps = {
  toast: Toast
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

  return (
    <div
      key={toast.id}
      css={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem',
        padding: '1.6rem',
        borderRadius: '0.8rem',
        backgroundColor: theme.color.surface,
        opacity: toast.visible ? 1 : 0,
        transition: '.5s',
      }}
      {...toast.ariaProps}
    >
      {useMemo(() => {
        switch (toast.type) {
          case 'loading':
            return <CircularProgressIndicator size="4rem" />
          case 'success':
            return (
              <div
                css={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '2rem',
                  backgroundColor: 'rgba(56, 212, 72, 0.25)',
                  color: '#38D448',
                }}
              >
                <Check width="2rem" height="2rem" />
              </div>
            )
          case 'error':
            return (
              <div
                css={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '2rem',
                  backgroundColor: 'rgba(210, 36, 36, 0.25)',
                  color: '#D22424',
                }}
              >
                <X width="2rem" height="2rem" />
              </div>
            )
        }
      }, [toast.type])}
      <Text.Body as="div">
        <Text.Body css={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <span>{firstMessage}</span>
          <Text.Body alpha="disabled" css={{ textAlign: 'end', alignSelf: 'first baseline', minWidth: '11rem' }}>
            {createdAtDistance}
          </Text.Body>
        </Text.Body>
        {messages}
      </Text.Body>
    </div>
  )
}

export default ToastBar
