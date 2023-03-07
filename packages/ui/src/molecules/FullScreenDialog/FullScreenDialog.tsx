import { keyframes, useTheme } from '@emotion/react'
import { X } from '@talismn/icons'
import { PropsWithChildren, ReactNode } from 'react'

import { Dialog, IconButton, Text } from '../../atoms'

export type FullScreenDialogProps = PropsWithChildren<{
  open?: boolean
  title: ReactNode
  onRequestDismiss: () => unknown
}>

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
  }
`

const slideUp = keyframes`
  from {
    transform: translateY(100%);
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

export const FullScreenDialogQuarterBreakPoint = '768px'

export const FulScreenDialogQuarterSelector = `@media(min-width: ${FullScreenDialogQuarterBreakPoint})`

const FullScreenDialog = ({ title, children, ...props }: FullScreenDialogProps) => {
  const theme = useTheme()
  return (
    <Dialog
      {...props}
      css={{
        'background': theme.color.surface,
        'border': 'none',
        'width': '100%',
        'maxWidth': '100%',
        'height': '100%',
        'maxHeight': '100%',
        'padding': '2.4rem',
        '&[open]': {
          'animation': `${slideUp} .5s`,
          '::backdrop': {
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(16px)',
            animation: `${backdropKeyframes} .5s forwards`,
          },
        },
        [`${FulScreenDialogQuarterSelector}`]: {
          'width': 'min-content',
          'marginLeft': 'auto',
          'marginRight': 0,
          'padding': '4.8rem',
          '&[open]': {
            animation: `${slideInRight} .5s`,
          },
        },
      }}
    >
      <header
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '5.2rem',
          [`${FulScreenDialogQuarterSelector}`]: {
            marginBottom: '4.8rem',
          },
        }}
      >
        <Text.H2 css={{ margin: 0 }}>{title}</Text.H2>
        <IconButton onClick={props.onRequestDismiss}>
          <X />
        </IconButton>
      </header>
      {children}
    </Dialog>
  )
}

export default FullScreenDialog
