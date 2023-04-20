import { useTheme } from '@emotion/react'
import { IconContext } from '@talismn/icons/utils'
import { type ElementType, type ReactNode, useMemo, type PropsWithChildren } from 'react'

import CircularProgressIndicator from '../CircularProgressIndicator'

type ButtonElementType = Extract<React.ElementType, 'button' | 'a'> | ElementType<any>

type PolymorphicButtonProps<T extends ButtonElementType = 'button'> = PropsWithChildren<{
  as?: T
  variant?:
    | 'outlined'
    | 'secondary'
    // Deprecated
    | 'noop'
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  disabled?: boolean
  hidden?: boolean
  loading?: boolean
}>

export type ButtonProps<T extends ButtonElementType = 'button'> = PolymorphicButtonProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof PolymorphicButtonProps<T>>

const Button = <T extends ButtonElementType = 'button'>({
  as = 'button' as T,
  variant,
  trailingIcon,
  leadingIcon,
  hidden,
  loading,
  ...props
}: ButtonProps<T>) => {
  const theme = useTheme()

  const disabled = Boolean(props.disabled) || Boolean(hidden) || Boolean(loading)

  const variantStyle = useMemo(() => {
    switch (variant) {
      case 'outlined':
        return {
          'backgroundColor': 'transparent',
          'color': theme.color.onBackground,
          'borderStyle': 'solid',
          'borderColor': theme.color.onBackground,
          'borderWidth': 1,
          ':hover': {
            color: theme.color.background,
            backgroundColor: theme.color.onBackground,
          },
        }
      case 'noop':
        return {
          'padding': 'none',
          'margin': 'none',
          'background': 'none',
          'border': 'none',
          'outline': 'none',
          ':hover': {
            filter: 'brightness(1.5)',
          },
        }
      case 'secondary':
        return {
          'backgroundColor': '#1B1B1B',
          'color': '#A5A5A5',
          ':hover': {
            filter: 'brightness(1.5)',
          },
        }
      case undefined:
        return {
          'backgroundColor': theme.color.primary,
          'color': theme.color.onPrimary,
          ':hover': {
            opacity: 0.8,
          },
        }
    }
  }, [theme.color.background, theme.color.onBackground, theme.color.onPrimary, theme.color.primary, variant])

  const variantDisabledStyle = useMemo(() => {
    switch (variant) {
      case undefined:
        return {
          backgroundColor: theme.color.foreground,
          color: `rgba(255,255,255,${theme.contentAlpha.disabled})`,
        }
      default:
        return { filter: 'grayscale(1) brightness(0.5)' }
    }
  }, [theme.color.foreground, theme.contentAlpha.disabled, variant])

  const hasLeadingIcon = Boolean(loading) || leadingIcon !== undefined

  const Component = as

  return (
    <Component
      {...(props as any)}
      disabled={disabled}
      css={[
        {
          textAlign: 'center',
          display: 'block',
          padding: '1.156rem 2.4rem',
          border: 'none',
          borderRadius: '1rem',
          cursor: 'pointer',
          transition: '.25s',
          ...variantStyle,
          ...(disabled ? { ':hover': undefined } : {}),
        },
        hasLeadingIcon && { paddingLeft: '1.6rem' },
        trailingIcon && { paddingRight: '1.6rem' },
        loading && { cursor: 'wait' },
        props.disabled && [{ cursor: 'not-allowed' }, variantDisabledStyle],
        hidden && { cursor: 'default', pointerEvent: 'none', opacity: 0 },
      ]}
    >
      <div css={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <IconContext.Provider value={{ size: '1.6rem' }}>
          {(() => {
            if (loading) {
              return <CircularProgressIndicator size="1.6rem" />
            }

            if (leadingIcon) {
              return leadingIcon
            }

            return undefined
          })()}
        </IconContext.Provider>
        <span
          css={[
            { flex: 1, textAlign: 'center' },
            hasLeadingIcon && { translate: '-1.6rem' },
            trailingIcon && { translate: '1.6rem' },
          ]}
        >
          {props.children}
        </span>
        <IconContext.Provider value={{ size: '1.6rem' }}>
          {trailingIcon && <span>{trailingIcon}</span>}
        </IconContext.Provider>
      </div>
    </Component>
  )
}

export default Button
