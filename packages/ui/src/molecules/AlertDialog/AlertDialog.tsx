import { keyframes, useTheme } from '@emotion/react'
import { X } from '@talismn/icons'
import { type ReactNode } from 'react'

import { Button, Dialog, Surface, Text, type DialogProps } from '../../atoms'

export type AlertDialogProps = Omit<DialogProps, 'title'> & {
  title?: ReactNode
  content: ReactNode
  confirmButton?: ReactNode
  dismissButton?: ReactNode
  onRequestDismiss: () => unknown
  width?: string | number
}

export const ALERT_DIALOG_PADDING = '2.4rem'

const show = keyframes`
  from {
    opacity: 0;
    transform: translateY(2rem);
  }
`

const backdropKeyframes = keyframes`
  from {
    background: rgba(0,0,0,0);
    backdrop-filter: blur(0);
  }
  to {
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(16px);
  }
`

const AlertDialog = ({
  title,
  content,
  confirmButton,
  dismissButton,
  onRequestDismiss,
  width,
  ...props
}: AlertDialogProps) => {
  const theme = useTheme()

  return (
    <>
      <Surface
        as={Dialog}
        {...props}
        title={undefined}
        onClickBackdrop={onRequestDismiss}
        onClose={onRequestDismiss}
        onCancel={onRequestDismiss}
        css={{
          'padding': ALERT_DIALOG_PADDING,
          'background': theme.color.surface,
          'border': 'none',
          'borderRadius': '1.6rem',
          '&[open]': {
            'animation': `${show} .5s ease`,
            '::backdrop': {
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(16px)',
              animation: `${backdropKeyframes} .5s ease forwards`,
            },
          },
          'width': 'auto',
          '@media (min-width: 768px)': {
            width: width ?? 'revert',
          },
        }}
      >
        <header
          css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2.6rem' }}
        >
          <Text.H4 css={{ marginBottom: 0 }}>{title}</Text.H4>
          <Button variant="noop" onClick={onRequestDismiss}>
            <X size="1.6rem" />
          </Button>
        </header>
        {content}
        {(dismissButton || confirmButton) && (
          <div
            css={{
              'display': 'flex',
              'gap': '1.6rem',
              'marginTop': '4.6rem',
              '> *': {
                flex: 1,
              },
            }}
          >
            {dismissButton}
            {confirmButton}
          </div>
        )}
      </Surface>
    </>
  )
}

export default AlertDialog
