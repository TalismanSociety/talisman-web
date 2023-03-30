import { useTheme } from '@emotion/react'
import Color from 'colorjs.io'
import { ElementType, useMemo } from 'react'

type FloatingActionButtonElementType = Extract<React.ElementType, 'button' | 'a' | 'figure'>

type PolymorphicFloatingActionButtonProps<T extends FloatingActionButtonElementType> = {
  as?: T
  size?: string | number
  disabled?: boolean
  containerColor?: string
  hoverContainerColor?: string
  disabledContainerColor?: string
  contentColor?: string
  hoverContentColor?: string
  disabledContentColor?: string
}

export type FloatingActionButtonProps<T extends FloatingActionButtonElementType> =
  PolymorphicFloatingActionButtonProps<T> &
    Omit<React.ComponentPropsWithoutRef<T>, keyof PolymorphicFloatingActionButtonProps<T>>

const FloatingActionButton = <T extends FloatingActionButtonElementType = 'button'>({
  as = 'button' as T,
  size = '5.6rem',
  containerColor,
  hoverContainerColor,
  disabledContainerColor,
  contentColor,
  hoverContentColor,
  disabledContentColor,
  ...props
}: FloatingActionButtonProps<T>) => {
  const theme = useTheme()

  containerColor = containerColor ?? theme.color.primary
  hoverContainerColor = useMemo(
    () => hoverContainerColor ?? new Color(containerColor!).darken(0.15).display().toString(),
    []
  )
  contentColor = contentColor ?? theme.color.onPrimary
  hoverContentColor = hoverContentColor ?? contentColor
  disabledContentColor = useMemo(() => {
    if (disabledContentColor !== undefined) {
      return disabledContentColor
    }

    const color = new Color(contentColor ?? theme.color.onBackground)
    color.alpha = theme.contentAlpha.disabled

    return color.display().toString()
  }, [contentColor, disabledContentColor, theme.color.onBackground, theme.contentAlpha.disabled])

  const Component = as

  return (
    <Component
      {...(props as any)}
      css={[
        {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 0,
          padding: 0,
          width: size,
          height: size,
          border: 'none',
          borderRadius: '1.6rem',
          color: contentColor,
          backgroundColor: containerColor,
          overflow: 'hidden',
          transition: '.25s',
        },
        !props.disabled && {
          'cursor': 'pointer',
          ':hover': {
            backgroundColor: hoverContainerColor,
            color: hoverContentColor,
          },
        },
        props.disabled && {
          color: disabledContentColor,
          backgroundColor: disabledContainerColor,
          cursor: 'not-allowed',
        },
      ]}
    />
  )
}

export default FloatingActionButton
