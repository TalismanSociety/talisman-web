import { useTheme } from '@emotion/react'
import { IconContext } from '@talismn/icons/utils'
import { type ComponentPropsWithoutRef, type ElementType } from 'react'

export type IconElementType = Extract<ElementType, 'button' | 'a' | 'figure'> | ElementType<any>

type PolymorphicIconProps<T extends IconElementType> = {
  as?: T
  size?: string | number
  disabled?: boolean
  containerColor?: string
  contentColor?: string
}

export type IconProps<T extends IconElementType> = PolymorphicIconProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof PolymorphicIconProps<T>>

const Icon = <T extends IconElementType = 'button'>({
  as = 'button' as T,
  size = '4rem',
  containerColor = 'transparent',
  contentColor,

  ...props
}: IconProps<T>) => {
  const theme = useTheme()

  contentColor = contentColor ?? theme.color.onBackground

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
    >
      <IconContext.Provider value={{ size: `calc(${size} * 0.6)` }}>{props['children']}</IconContext.Provider>
    </Component>
  )
}

export default Icon
