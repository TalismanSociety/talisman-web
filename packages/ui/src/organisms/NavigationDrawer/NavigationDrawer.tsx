import { keyframes, useTheme } from '@emotion/react'
import { X } from '@talismn/icons'
import { IconContext } from '@talismn/icons/utils'
import {
  createContext,
  useCallback,
  useContext,
  type AnchorHTMLAttributes,
  type DetailedHTMLProps,
  type PropsWithChildren,
  type ReactNode,
} from 'react'

import { Dialog, IconButton, Text } from '../../atoms'

export type BaseNavigationDrawerProps = {
  open?: boolean
  onRequestDismiss?: () => unknown
}

export type NavigationDrawerProps = PropsWithChildren<
  BaseNavigationDrawerProps & {
    headerIcon?: ReactNode
    footer?: ReactNode
  }
>

export type NavigationDrawerItemProps = {
  label: ReactNode
  icon: ReactNode
  onClick?: () => unknown
}

const backdropKeyframes = keyframes`
  from {
    background: rgba(18,18,18,0);
    backdrop-filter: blur(0);
  }
  to {
    background: rgba(18,18,18,0.9);
    backdrop-filter: blur(32px);
  }
`

const Context = createContext<BaseNavigationDrawerProps>({})

const NavigationDrawerItem = (props: NavigationDrawerItemProps) => {
  const theme = useTheme()
  const context = useContext(Context)

  return (
    <button
      onClick={useCallback(() => {
        props.onClick?.()
        context.onRequestDismiss?.()
      }, [context, props])}
      css={{
        'border': 'none',
        'borderRadius': '2.4rem',
        'boxShadow': '0px 2px 2px rgba(0, 0, 0, 0.25)',
        'width': '100%',
        'padding': '2.4rem 4rem',
        'backgroundColor': `color-mix(in srgb, ${theme.color.foregroundVariant}, transparent 60%)`,
        'cursor': 'pointer',
        ':hover': { filter: 'brightness(1.2)' },
      }}
    >
      <Text.BodyLarge
        alpha="high"
        css={{
          'display': 'flex',
          'alignItems': 'center',
          'gap': '3.7rem',
          '@media(min-width: 375px)': { fontSize: '2.4rem' },
        }}
      >
        <IconContext.Provider value={{ size: '1em' }}>{props.icon}</IconContext.Provider>
        {props.label}
      </Text.BodyLarge>
    </button>
  )
}

const NavigationDrawerFooter = Object.assign(
  (props: PropsWithChildren) => (
    <Text.Body
      as="footer"
      {...props}
      css={{
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        gap: '1.8rem',
        flexWrap: 'wrap',
        position: 'sticky',
        top: '100vh',
        padding: '0 4.8rem',
        margin: '3.6rem 0 4rem 0',
      }}
    />
  ),
  {
    Icon: (props: PropsWithChildren) => (
      <Text.Body alpha={({ hover }) => (hover ? 'high' : 'medium')}>{props.children}</Text.Body>
    ),
    A: (props: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => (
      <Text.Body alpha={({ hover }) => (hover ? 'high' : 'medium')} {...props} />
    ),
  }
)

const NavigationDrawer = Object.assign(
  (props: NavigationDrawerProps) => (
    <Dialog
      open={props.open}
      onClickBackdrop={props.onRequestDismiss}
      css={{
        'width': '100%',
        'maxWidth': '100%',
        'height': '100%',
        'maxHeight': '100%',
        'border': 'none',
        'margin': 0,
        'padding': 0,
        'backgroundColor': 'transparent',
        '&[open]': {
          '::backdrop': {
            background: 'rgba(18,18,18,0.9)',
            backdropFilter: 'blur(32px)',
            animation: `${backdropKeyframes} .5s ease forwards`,
          },
        },
      }}
    >
      <Context.Provider value={{ open: props.open, onRequestDismiss: props.onRequestDismiss }}>
        <header
          css={{
            position: 'sticky',
            top: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.6rem 2.4rem',
            marginBottom: '1.6rem',
          }}
        >
          <div>{props.headerIcon}</div>
          <IconButton onClick={props.onRequestDismiss}>
            <X />
          </IconButton>
        </header>
        <ul
          css={{
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: '1.2rem',
            padding: '0 4.8rem',
          }}
        >
          {props.children}
        </ul>
        {props.footer}
      </Context.Provider>
    </Dialog>
  ),
  { Item: NavigationDrawerItem, Footer: NavigationDrawerFooter }
)

export default NavigationDrawer
