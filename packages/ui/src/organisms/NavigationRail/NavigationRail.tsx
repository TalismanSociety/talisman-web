import { useTheme } from '@emotion/react'
import { type PropsWithChildren, type ReactNode } from 'react'

import { Surface, Tooltip, useSurfaceColorAtElevation } from '../../atoms'
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
  const surfaceColor = useSurfaceColorAtElevation(x => x - 1)

  return (
    <Tooltip content={props.label}>
      <FloatingActionButton
        // @ts-expect-error
        as="li"
        aria-label={props.label}
        containerColor={surfaceColor}
        hoverContainerColor={theme.color.onSurface}
        contentColor={theme.color.onSurface}
        hoverContentColor={surfaceColor}
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
      <Surface
        as="nav"
        css={[
          {
            display: 'flex',
            flexDirection: 'column-reverse',
            justifyContent: 'space-between',
            gap: '2rem',
            alignItems: 'center',
            borderRadius: theme.shape.large,
            padding: '4.8rem 2.2rem',
            width: 'fit-content',
            height: '100%',
            overflowY: 'auto',
          },
          props.header === undefined && {
            justifyContent: 'center',
          },
        ]}
      >
        {props.header ? <header css={{ marginTop: '3rem' }}>{props.header}</header> : null}
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.2rem',
          }}
        >
          {props.children}
        </div>
      </Surface>
    )
  },
  { Item: NavigationRailItem }
)

export default NavigationRail
