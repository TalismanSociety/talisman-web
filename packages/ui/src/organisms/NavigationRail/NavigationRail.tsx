import { useTheme } from '@emotion/react'
import { type PropsWithChildren, type ReactNode } from 'react'

import { Tooltip } from '../../atoms'
import FloatingActionButton from '../../atoms/FloatingActionButton'

export type NavigationRailProps = PropsWithChildren<{
  header?: ReactNode
}>

export type NavigationRailItemProps = {
  label: ReactNode
  icon: ReactNode
  onClick?: () => unknown
}

export const NavigationRailItem = (props: NavigationRailItemProps) => {
  const theme = useTheme()

  return (
    <Tooltip content={props.label}>
      <FloatingActionButton
        // @ts-expect-error
        as="li"
        aria-label={props.label}
        containerColor={theme.color.surface}
        hoverContainerColor={theme.color.onSurface}
        contentColor={theme.color.onSurface}
        hoverContentColor={theme.color.surface}
        onClick={props.onClick}
      >
        {props.icon}
      </FloatingActionButton>
    </Tooltip>
  )
}

const NavigationRail = Object.assign(
  (props: NavigationRailProps) => {
    const theme = useTheme()
    return (
      <nav
        css={[
          {
            display: 'flex',
            flexDirection: 'column-reverse',
            justifyContent: 'space-between',
            gap: '2rem',
            alignItems: 'center',
            borderRadius: '1.6rem',
            padding: '4.8rem 2.2rem',
            backgroundColor: theme.color.surface,
            width: 'fit-content',
            minHeight: '70vh',
            maxHeight: '90vh',
          },
          props.header === undefined && {
            minHeight: 'unset',
          },
        ]}
      >
        <header>{props.header}</header>
        <ul
          css={{
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.2rem',
            padding: 0,
          }}
        >
          {props.children}
        </ul>
      </nav>
    )
  },
  { Item: NavigationRailItem }
)

export default NavigationRail
