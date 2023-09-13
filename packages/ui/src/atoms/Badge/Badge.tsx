import type { CSSProperties, PropsWithChildren, ReactNode } from 'react'
import { Text } from '..'
import { IconContext } from '@talismn/icons/utils'

export type BadgeProps = PropsWithChildren<{
  className?: string
  style?: CSSProperties
  containerColor?: string
  contentColor?: string
}>

const Badge = (props: BadgeProps) => (
  <Text.BodySmall
    as="div"
    {...props}
    color={theme => props.contentColor ?? theme.color.onError}
    css={theme => ({
      display: 'inline-block',
      borderRadius: '0.8em',
      minWidth: '1.6em',
      lineHeight: '1em',
      padding: '0.3em',
      backgroundColor: theme.color.error,
      textAlign: 'center',
      svg: { display: 'block' },
    })}
    style={{ backgroundColor: props.containerColor }}
  >
    <IconContext.Provider value={{ size: '1em' }}>{props.children}</IconContext.Provider>
  </Text.BodySmall>
)

export type BadgedBoxProps = PropsWithChildren<{ badge: ReactNode; overlap?: 'rectangular' | 'circular' }>

export const BadgedBox = ({ overlap = 'rectangular', ...props }: BadgedBoxProps) => {
  return (
    <div
      css={{
        position: 'relative',
        // Trick to make parent height equal to child
        display: 'flex',
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

export default Badge
