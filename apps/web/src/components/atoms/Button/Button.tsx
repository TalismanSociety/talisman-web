import { useTheme } from '@emotion/react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import CircularProgressIndicator from '../CircularProgressIndicator'

type ButtonElementType = Extract<React.ElementType, 'button' | 'a'> | typeof Link

type PolymorphicButtonProps<T extends ButtonElementType> = {
  as?: T
  variant?: 'outlined' | 'noop' | 'secondary'
  disabled?: boolean
  hidden?: boolean
  loading?: boolean
}

export type ButtonProps<T extends ButtonElementType> = PolymorphicButtonProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof PolymorphicButtonProps<T>>

const Button = <T extends ButtonElementType>({
  as = 'button' as T,
  hidden,
  loading,
  variant,
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
      <span css={{ position: 'relative' }}>
        {loading && (
          <span css={{ position: 'absolute', left: '-1.2rem', top: '0.1rem' }}>
            <CircularProgressIndicator size="1.6rem" />
          </span>
        )}
        <span css={{ display: 'inline-block', transform: loading ? 'translateX(1rem)' : undefined }}>
          {props.children}
        </span>
      </span>
    </Component>
  )
}

export default Button
