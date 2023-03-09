import { useTheme } from '@emotion/react'
import { IconContext } from '@talismn/icons'
import { ElementType, ReactNode, useMemo } from 'react'

import CircularProgressIndicator from '../CircularProgressIndicator'

type ButtonElementType = Extract<React.ElementType, 'button' | 'a'> | ElementType<any>

type PolymorphicButtonProps<T extends ButtonElementType> = {
  as?: T
  variant?: 'outlined' | 'noop' | 'secondary'
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  disabled?: boolean
  hidden?: boolean
  loading?: boolean
}

export type ButtonProps<T extends ButtonElementType> = PolymorphicButtonProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof PolymorphicButtonProps<T>>

const Button = <T extends ButtonElementType>({
  as = 'button' as T,
  variant,
  trailingIcon,
  leadingIcon,
  hidden,
  loading,
  ...props
}: ButtonProps<T>) => {
  const theme = useTheme()

  const disabled = props.disabled || hidden || loading

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

  const Component = as

  const hasLeadingIcon = loading || leadingIcon !== undefined

  return (
    <Component
      {...(props as any)}
      disabled={disabled}
      css={[
        {
          display: 'block',
          padding: '1.156rem 2.4rem',
          border: 'none',
          borderRadius: '1rem',
          cursor: 'pointer',
          transition: '.25s',
          ...variantStyle,
          ...(disabled ? { ':hover': undefined } : {}),
        },
        loading && { cursor: 'wait' },
        props.disabled && [{ cursor: 'not-allowed' }, variantDisabledStyle],
        hidden && { cursor: 'default', pointerEvent: 'none', opacity: 0 },
      ]}
    >
      <div css={{ position: 'relative', width: '100%' }}>
        {(leadingIcon || loading) && (
          <span
            css={{
              position: 'absolute',
              left: '-1.2rem',
              top: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <IconContext.Provider value={{ size: '1.6rem' }}>
              {(() => {
                if (loading) {
                  return <CircularProgressIndicator size="1.6rem" />
                }

                if (leadingIcon) {
                  return leadingIcon
                }
              })()}
            </IconContext.Provider>
          </span>
        )}
        <span
          css={[
            { display: 'inline-block' },
            hasLeadingIcon && !trailingIcon && { transform: 'translateX(1rem)' },
            trailingIcon && !hasLeadingIcon && { transform: 'translateX(-1rem)' },
            hasLeadingIcon && trailingIcon && { padding: '0 2rem' },
          ]}
        >
          {props.children}
        </span>
        {trailingIcon && (
          <span
            css={{
              position: 'absolute',
              right: '-1.6rem',
              top: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {trailingIcon}
          </span>
        )}
      </div>
    </Component>
  )
}

export default Button
