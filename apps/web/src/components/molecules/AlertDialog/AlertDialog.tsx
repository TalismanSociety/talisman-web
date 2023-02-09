import Button from '@components/atoms/Button'
import Dialog, { DialogProps } from '@components/atoms/Dialog'
import { X } from '@components/atoms/Icon'
import Text from '@components/atoms/Text'
import { Global, keyframes, useTheme } from '@emotion/react'
import { ReactNode } from 'react'

export type AlertDialogProps = DialogProps & {
  title?: string
  content: ReactNode
  confirmButton?: ReactNode
  dismissButton?: ReactNode
  onRequestDismiss: () => unknown
  width?: string | number
}

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
      {props.open && <Global styles={{ body: { overflow: 'hidden' } }} />}
      <Dialog
        {...props}
        title={undefined}
        onClickBackdrop={onRequestDismiss}
        onClose={onRequestDismiss}
        onCancel={onRequestDismiss}
        css={{
          'padding': '2.4rem',
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
          '@media (min-width: 768px)': {
            width: width,
          },
        }}
      >
        <header
          css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2.6rem' }}
        >
          <Text.H4 css={{ marginBottom: 0 }}>{title}</Text.H4>
          <Button variant="noop" onClick={onRequestDismiss}>
            <X width="1.6rem" height="1.6rem" />
          </Button>
        </header>
        {content}
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
      </Dialog>
    </>
  )
}

export default AlertDialog
