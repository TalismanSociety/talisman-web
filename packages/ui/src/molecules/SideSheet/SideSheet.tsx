import { keyframes, useTheme } from '@emotion/react'
import { X } from '@talismn/web-icons'
import { type ReactNode } from 'react'
import { Dialog, IconButton, Text, type DialogProps } from '../../atoms'
import { Toaster } from '../../organisms'
import { useMediaQuery } from '../../utils'

export type SideSheetProps = Omit<DialogProps, 'title'> & {
  title: ReactNode
  subtitle?: ReactNode
  onRequestDismiss: () => unknown
  headerClassName?: string
  contentContainerClassName?: string
}

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

export const SIDE_SHEET_WIDE_BREAK_POINT = '768px'

export const SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR = `@media(min-width: ${SIDE_SHEET_WIDE_BREAK_POINT})`

const SideSheet = ({ title, children, ...props }: SideSheetProps) => {
  const theme = useTheme()
  return (
    <Dialog
      {...props}
      onClickBackdrop={props.onRequestDismiss}
      css={{
        background: theme.color.background,
        border: 'none',
        width: '100%',
        maxWidth: '100%',
        height: '100%',
        maxHeight: '100%',
        padding: 0,
        '&[open]': {
          animation: `${slideUp} .5s`,
          '::backdrop': {
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(16px)',
            animation: `${backdropKeyframes} .5s forwards`,
          },
        },
        [`${SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR}`]: {
          width: 'min-content',
          marginLeft: 'auto',
          marginRight: 0,
          '&[open]': {
            animation: `${slideInRight} .5s`,
          },
        },
      }}
    >
      <header
        className={props.headerClassName}
        css={{
          marginBottom: '5.2rem',
          padding: '2.4rem 2.4rem 0 2.4rem',
          [`${SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR}`]: {
            padding: '4.8rem 4.8rem 0 4.8rem',
            marginBottom: '4.8rem 4.8rem 0 4.8rem',
          },
        }}
      >
        <div>
          <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <Text.H2 css={{ margin: 0 }}>{title}</Text.H2>
            <IconButton onClick={props.onRequestDismiss}>
              <X />
            </IconButton>
          </div>
          {props.subtitle && (
            <Text.BodyLarge as="div" css={{ marginTop: '1.6rem' }}>
              {props.subtitle}
            </Text.BodyLarge>
          )}
        </div>
      </header>
      <div
        className={props.contentContainerClassName}
        css={{
          padding: '0 2.4rem 2.4rem 2.4rem',
          [`${SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR}`]: {
            padding: '0 4.8rem 4.8rem 4.8rem',
          },
        }}
      >
        {children}
      </div>
      <Toaster position={useMediaQuery(SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR) ? 'bottom-right' : 'bottom-center'} />
    </Dialog>
  )
}

export default SideSheet
