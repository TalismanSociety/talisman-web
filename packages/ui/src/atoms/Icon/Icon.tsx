import { useSurfaceColor } from '..'
import { useTheme } from '@emotion/react'
import { IconContext } from '@talismn/web-icons/utils'
import { type ComponentPropsWithoutRef, type ElementType } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

const Icon = <T extends IconElementType = 'figure'>({
  as = 'figure' as T,
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <IconContext.Provider value={{ size: `calc(${size} * 0.5)` }}>{(props as any)['children']}</IconContext.Provider>
    </Component>
  )
}

export const TonalIcon = <T extends IconElementType>(props: IconProps<T>) => {
  const theme = useTheme()
  const contentColor = props.contentColor ?? theme.color.primary
  const containerColor = props.containerColor ?? `color-mix(in srgb, ${contentColor}, transparent 90%)`

  return <Icon {...props} containerColor={containerColor} contentColor={contentColor} />
}

export const SurfaceIcon = <T extends IconElementType>(props: IconProps<T>) => {
  const theme = useTheme()
  const surfaceColor = useSurfaceColor()
  const contentColor = props.contentColor ?? theme.color.onSurface
  const containerColor = props.containerColor ?? surfaceColor

  return <Icon {...props} containerColor={containerColor} contentColor={contentColor} />
}

export default Icon
