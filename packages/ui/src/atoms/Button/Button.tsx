import { useSurfaceColor } from '..'
import CircularProgressIndicator from '../CircularProgressIndicator'
import { useTheme } from '@emotion/react'
import { IconContext } from '@talismn/web-icons/utils'
import { useCallback, useMemo, useTransition, type ElementType, type PropsWithChildren, type ReactNode } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ButtonElementType = Extract<React.ElementType, 'button' | 'a'> | ElementType<any>

type PolymorphicButtonProps<T extends ButtonElementType = 'button'> = PropsWithChildren<{
  as?: T
  /**
   * @deprecated use variant components
   */
  variant?:
    | 'outlined'
    | 'text'
    | 'tonal'
    | 'surface'
    /**
     * @deprecated use "surface" variant instead
     */
    | 'secondary'
    /**
     * @deprecated use `Clickable` instead
     */
    | 'noop'
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  disabled?: boolean
  hidden?: boolean
  loading?: boolean
  withTransition?: boolean
}>

export type ButtonProps<T extends ButtonElementType = 'button'> = PolymorphicButtonProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof PolymorphicButtonProps<T>>

const Button = <T extends ButtonElementType = 'button'>({
  as = 'button' as T,
  variant,
  trailingIcon,
  leadingIcon,
  hidden,
  loading: _loading = false,
  withTransition = false,
  ...props
}: ButtonProps<T>) => {
  const theme = useTheme()

  const [isPending, startTransition] = useTransition()
  const loading = _loading || isPending

  const disabled = Boolean(props.disabled) || Boolean(hidden) || Boolean(loading)

  const surfaceColor = useSurfaceColor()

  const variantStyle = useMemo(() => {
    switch (variant) {
      case 'secondary':
      case 'surface':
        return {
          backgroundColor: surfaceColor,
          color: theme.color.onSurface,
          ':hover': {
            opacity: 0.6,
          },
        }
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          color: theme.color.onBackground,
          borderStyle: 'solid',
          borderColor: theme.color.onBackground,
          borderWidth: 1,
          ':hover': {
            color: theme.color.background,
            backgroundColor: theme.color.onBackground,
          },
        }
      case 'tonal':
        return {
          backgroundColor: `color-mix(in srgb, ${theme.color.primary}, transparent 90%)`,
          color: theme.color.primary,
          ':hover': {
            opacity: 0.6,
          },
        }
      case 'text':
        return {
          backgroundColor: 'transparent',
          color: theme.color.primary,
        }
      case 'noop':
        return {
          padding: 'none',
          margin: 'none',
          background: 'none',
          border: 'none',
          outline: 'none',
          ':hover': {
            filter: 'brightness(1.5)',
          },
        }
      case undefined:
        return {
          backgroundColor: theme.color.primaryContainer,
          color: theme.color.onPrimary,
          ':hover': {
            opacity: 0.6,
          },
        }
    }
  }, [
    surfaceColor,
    theme.color.background,
    theme.color.onBackground,
    theme.color.onPrimary,
    theme.color.onSurface,
    theme.color.primary,
    theme.color.primaryContainer,
    variant,
  ])

  const variantDisabledStyle = useMemo(() => {
    switch (variant) {
      case undefined:
        return {
          backgroundColor: surfaceColor,
          color: `color-mix(in srgb, ${theme.color.onSurface}, transparent ${Math.round(
            (1 - theme.contentAlpha.disabled) * 100
          )}%)`,
        }
      default:
        return { filter: 'grayscale(1) brightness(0.5)' }
    }
  }, [surfaceColor, theme.color.onSurface, theme.contentAlpha.disabled, variant])

  const hasLeadingIcon = Boolean(loading) || leadingIcon !== undefined

  const onClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...args: any[]) => {
      if (withTransition) {
        return startTransition(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(props as any).onClick?.(...args)
        })
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (props as any).onClick?.(...args)
      }
    },
    [props, withTransition]
  )

  const Component = as

  return (
    <Component
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(props as any)}
      onClick={onClick}
      disabled={disabled}
      css={[
        theme.typography.body,
        {
          textAlign: 'center',
          display: 'inline-flex',
          padding: '1.156rem 2.4rem',
          width: 'fit-content',
          border: 'none',
          borderRadius: theme.shape.full,
          cursor: 'pointer',
          transition: '.25s',
          ...variantStyle,
          ...(disabled ? { ':hover': undefined } : {}),
        },
        hasLeadingIcon && { paddingInlineStart: '1.6rem' },
        trailingIcon && { paddingInlineEnd: '1.6rem' },
        loading && { cursor: 'wait' },
        props.disabled && [{ cursor: 'not-allowed' }, variantDisabledStyle],
        hidden && { cursor: 'default', pointerEvent: 'none', opacity: 0 },
      ]}
    >
      <div css={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem' }}>
        {hasLeadingIcon && (
          <IconContext.Provider value={{ size: '1.8rem' }}>
            {(() => {
              if (loading) {
                return <CircularProgressIndicator size="1.6rem" />
              }

              if (leadingIcon) {
                return <div css={{ display: 'flex' }}>{leadingIcon}</div>
              }

              return undefined
            })()}
          </IconContext.Provider>
        )}
        <span css={{ textAlign: 'center' }}>{props.children}</span>
        {trailingIcon && (
          <IconContext.Provider value={{ size: '1.8rem' }}>
            <div css={{ display: 'flex' }}>{trailingIcon}</div>
          </IconContext.Provider>
        )}
      </div>
    </Component>
  )
}

export default Button

export const OutlinedButton = <T extends ButtonElementType = 'button'>(props: Omit<ButtonProps<T>, 'variant'>) => (
  // @ts-expect-error
  <Button {...props} variant="outlined" />
)

export const TonalButton = <T extends ButtonElementType = 'button'>(props: Omit<ButtonProps<T>, 'variant'>) => (
  // @ts-expect-error
  <Button {...props} variant="tonal" />
)

export const TextButton = <T extends ButtonElementType = 'button'>(props: Omit<ButtonProps<T>, 'variant'>) => (
  // @ts-expect-error
  <Button {...props} variant="text" />
)

export const SurfaceButton = <T extends ButtonElementType = 'button'>(props: Omit<ButtonProps<T>, 'variant'>) => (
  // @ts-expect-error
  <Button {...props} variant="surface" />
)
