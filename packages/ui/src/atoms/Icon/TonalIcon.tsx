import { useTheme } from '@emotion/react'
import type { IconElementType, IconProps } from './Icon'
import Icon from './Icon'

export type TonalIconProps<T extends IconElementType> = IconProps<T>

const TonalIcon = <T extends IconElementType>(props: TonalIconProps<T>) => {
  const theme = useTheme()
  const contentColor = props.contentColor ?? theme.color.primary
  const containerColor = props.containerColor ?? `color-mix(in srgb, ${contentColor}, transparent 90%)`

  return <Icon {...props} containerColor={containerColor} contentColor={contentColor} />
}

export default TonalIcon
