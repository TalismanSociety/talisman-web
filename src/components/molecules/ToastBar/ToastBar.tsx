import CircularProgressIndicator from '@components/atoms/CircularProgressIndicator'
import { Check, X } from '@components/atoms/Icon'
import Text from '@components/atoms/Text'
import { useTheme } from '@emotion/react'
import { formatDistanceToNow } from 'date-fns'
import React, { useMemo } from 'react'
import { Toast } from 'react-hot-toast'

export type ToastBarProps = {
  toast: Toast
}

const ToastBar = ({ toast }: ToastBarProps) => {
  const theme = useTheme()
  const message = typeof toast.message === 'function' ? toast.message(toast) : toast.message

  return (
    <div
      css={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem',
        padding: '1.6rem',
        borderRadius: '0.8rem',
        backgroundColor: theme.color.surface,
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
      <Text.Body as="div">{message}</Text.Body>
      <Text.Body alpha="disabled" css={{ alignSelf: 'first baseline' }}>
        {formatDistanceToNow(toast.createdAt, { addSuffix: true })}
      </Text.Body>
    </div>
  )
}

export default ToastBar
