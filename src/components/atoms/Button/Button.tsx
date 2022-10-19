import { jsx, useTheme } from '@emotion/react'
import { useMemo } from 'react'

type ButtonElementType = Pick<JSX.IntrinsicElements, 'button' | 'a'>

type PolymorphicTextProps<T extends keyof ButtonElementType> = { as?: T; variant?: 'outlined' | 'noop' }

export type ButtonProps<T extends keyof ButtonElementType> = PolymorphicTextProps<T> & ButtonElementType[T]

const Button = <T extends keyof ButtonElementType>({ as = 'button' as T, variant, ...props }: ButtonProps<T>) => {
  const theme = useTheme()

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
          padding: 'none',
          margin: 'none',
          background: 'none',
          border: 'none',
          outline: 'none',
        }
      default:
        return {
          'backgroundColor': theme.color.primary,
          'color': theme.color.onPrimary,
          ':hover': {
            opacity: 0.8,
          },
        }
    }
  }, [theme.color.background, theme.color.onBackground, theme.color.onPrimary, theme.color.primary, variant])

  return jsx(as ?? 'button', {
    ...props,
    css: {
      display: 'block',
      padding: '1.156rem 1.6rem',
      border: 'none',
      borderRadius: '1rem',
      cursor: 'pointer',
      ...variantStyle,
    },
  })
}

export default Button
