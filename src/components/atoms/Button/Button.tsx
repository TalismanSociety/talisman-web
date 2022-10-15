import { jsx, useTheme } from '@emotion/react'
import { useMemo } from 'react'

import CircularProgressIndicator from '../CircularProgressIndicator'

type ButtonElementType = Pick<JSX.IntrinsicElements, 'button' | 'a'>

type PolymorphicTextProps<T extends keyof ButtonElementType> = {
  as?: T
  variant?: 'outlined' | 'noop'
  loading?: boolean
}

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
    children: (
      <span css={{ position: 'relative' }}>
        {props.loading && (
          <span css={{ position: 'absolute', left: '-1.2rem', top: '0.1rem' }}>
            <CircularProgressIndicator size="1.6rem" />
          </span>
        )}
        <span css={{ display: 'inline-block', transform: props.loading ? 'translateX(1rem)' : undefined }}>
          {props.children}
        </span>
      </span>
    ),
    css: {
      display: 'block',
      padding: '1.156rem 2.4rem',
      border: 'none',
      borderRadius: '1rem',
      cursor: 'pointer',
      ...variantStyle,
    },
  })
}

export default Button
