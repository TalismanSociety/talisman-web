import type { CSSProperties, PropsWithChildren, ReactNode } from 'react'
import { IconContext } from '@talismn/web-icons/utils'

import { Text } from './Text'

export type BadgeProps = PropsWithChildren<{
  className?: string
  style?: CSSProperties
  containerColor?: string
  contentColor?: string
}>

export const Badge = ({ containerColor, contentColor, children, ...passProps }: BadgeProps) => (
  <Text.BodySmall
    as="div"
    {...passProps}
    css={theme => [
      {
        color: contentColor ?? theme.color.onError,
        display: 'inline-block',
        borderRadius: theme.shape.full,
        minWidth: '1.6em',
        lineHeight: '1em',
        padding: '0.3em',
        backgroundColor: theme.color.error,
        textAlign: 'center',
        svg: { display: 'block' },
      },
      children === undefined && { minWidth: 'revert', width: '0.8rem', height: '0.8rem' },
    ]}
    style={{ backgroundColor: containerColor }}
  >
    <IconContext.Provider value={{ size: '1em' }}>{children}</IconContext.Provider>
  </Text.BodySmall>
)

export type BadgedBoxProps = PropsWithChildren<{ badge: ReactNode; overlap?: 'rectangular' | 'circular' }>

export const BadgedBox = ({ overlap = 'rectangular', ...props }: BadgedBoxProps) => {
  return (
    <div
      css={{
        position: 'relative',
        // Trick to make parent height equal to child
        display: 'inline-flex',
      }}
    >
      {props.children}
      <div
        css={[
          {
            position: 'absolute',
            transform: 'scale(1) translate(50%, -50%)',
            transformOrigin: '100% 0% 0px',
          },
          overlap === 'rectangular'
            ? {
                top: 0,
                right: 0,
              }
            : {
                top: '14%',
                right: '14%',
              },
        ]}
      >
        {props.badge}
      </div>
    </div>
  )
}
