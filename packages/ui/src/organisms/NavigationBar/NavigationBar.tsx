import { useTheme } from '@emotion/react'
import { type PropsWithChildren, type ReactNode } from 'react'

import { Button, IconButton, Text } from '../../atoms'

export type NavigationBarProps = PropsWithChildren

export type NavigationBarItemProps = {
  label: ReactNode
  icon: ReactNode
  onClick?: () => unknown
}

export const NavigationBarItem = (props: NavigationBarItemProps) => (
  <Button as="li" variant="noop" onClick={props.onClick}>
    <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <IconButton css={{ height: '4rem', pointerEvents: 'none' }}>{props.icon}</IconButton>
      <Text.BodySmall css={{ textAlign: 'center' }}>{props.label}</Text.BodySmall>
    </div>
  </Button>
)

const NavigationBar = Object.assign(
  (props: NavigationBarProps) => {
    const theme = useTheme()
    return (
      <ul
        css={{
          listStyle: 'none',
          display: 'flex',
          justifyContent: 'space-evenly',
          gap: '1.2rem',
          width: '100%',
          margin: 0,
          borderTop: `1px solid ${theme.color.border}`,
          padding: '1.2rem 2.35rem',
          backgroundColor: theme.color.background,
        }}
      >
        {props.children}
      </ul>
    )
  },
  { Item: NavigationBarItem }
)

export default NavigationBar
