import { useTheme } from '@emotion/react'
import Color from 'colorjs.io'
import { ComponentPropsWithoutRef, ElementType, useMemo } from 'react'

type IconButtonElementType = Extract<ElementType, 'button' | 'a' | 'figure'> | ElementType<any>

type PolymorphicIconButtonProps<T extends IconButtonElementType> = {
  as?: T
  size?: string | number
  disabled?: boolean
  containerColor?: string
  contentColor?: string
  disabledContainerColor?: string
  disabledContentColor?: string
}

export type IconButtonProps<T extends IconButtonElementType> = PolymorphicIconButtonProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof PolymorphicIconButtonProps<T>>

const IconButton = <T extends IconButtonElementType = 'button'>({
  as = 'button' as T,
  size = '4rem',
  containerColor = 'transparent',
  contentColor,
  disabledContainerColor,
  disabledContentColor,
  ...props
}: IconButtonProps<T>) => {
  const theme = useTheme()

  contentColor = contentColor ?? theme.color.onBackground
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
          borderRadius: `calc(${size}/2)`,
          color: contentColor,
          backgroundColor: containerColor,
          overflow: 'hidden',
          transition: '.25s',
        },
        props.onClick !== undefined && {
          'cursor': 'pointer',
          ':hover': {
            filter: 'brightness(1.2)',
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

export default IconButton
