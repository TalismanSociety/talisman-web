import { Button, IconButton, Text } from '../../atoms'
import { useTheme } from '@emotion/react'
import { type DetailedHTMLProps, type HTMLAttributes, type ReactNode } from 'react'

export type TopAppBarProps = {
  navigationIcon?: ReactNode
  title?: ReactNode
  actions?: ReactNode
}

export type TopAppBarItemProps = {
  label: ReactNode
  icon: ReactNode
  onClick?: () => unknown
}

export const TopAppBarItem = (props: TopAppBarItemProps) => (
  <Button as="li" variant="noop" onClick={props.onClick}>
    <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <IconButton css={{ height: '4rem', pointerEvents: 'none' }}>{props.icon}</IconButton>
      <Text.BodySmall css={{ textAlign: 'center' }}>{props.label}</Text.BodySmall>
    </div>
  </Button>
)

const TopAppBar = Object.assign(
  (props: TopAppBarProps) => {
    const theme = useTheme()
    return (
      <section
        css={{
          listStyle: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.2rem',
          width: '100%',
          padding: '1.6rem 2.4rem',
          backgroundColor: theme.color.background,
        }}
      >
        {props.navigationIcon}
        {props.title && <Text.H3 as="h1">{props.title}</Text.H3>}
        {props.actions}
      </section>
    )
  },
  {
    Item: TopAppBarItem,
    Actions: (props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
      <div {...props} css={{ display: 'flex', alignItems: 'center', gap: '1.8rem' }} />
    ),
  }
)

export default TopAppBar
