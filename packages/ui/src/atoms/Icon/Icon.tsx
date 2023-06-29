import { useTheme } from '@emotion/react'
import { type ComponentPropsWithoutRef, type ElementType } from 'react'

export type IconElementType = Extract<ElementType, 'button' | 'a' | 'figure'> | ElementType<any>

type PolymorphicIconProps<T extends IconElementType> = {
  as?: T
  size?: string | number
  disabled?: boolean
  containerColor?: string
  contentColor?: string
  disabledContainerColor?: string
  disabledContentColor?: string
}

export type IconProps<T extends IconElementType> = PolymorphicIconProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof PolymorphicIconProps<T>>

const Icon = <T extends IconElementType = 'button'>({
  as = 'button' as T,
  size = '4rem',
  containerColor = 'transparent',
  contentColor,
  disabledContainerColor,
  disabledContentColor,
  ...props
}: IconProps<T>) => {
  const theme = useTheme()

  contentColor = contentColor ?? theme.color.onBackground
  disabledContentColor =
    disabledContentColor !== undefined
      ? disabledContentColor
      : `color-mix(in srgb, ${contentColor}, transparent ${Math.round((1 - theme.contentAlpha.disabled) * 100)}%)`

  const Component = as

  return (
    <Component
      {...(props as any)}
      css={{
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
      }}
    />
  )
}

export default Icon
