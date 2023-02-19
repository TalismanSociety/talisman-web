import { useTheme } from '@emotion/react'
import Color from 'colorjs.io'
import { ForwardedRef, forwardRef, useMemo } from 'react'
import { Link } from 'react-router-dom'

type IconButtonElementType = Extract<React.ElementType, 'button' | 'a'> | typeof Link

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
  Omit<React.ComponentPropsWithoutRef<T>, keyof PolymorphicIconButtonProps<T>>

const IconButton = forwardRef(
  <T extends IconButtonElementType>(
    {
      as = 'IconButton' as T,
      size = '4rem',
      containerColor,
      contentColor,
      disabledContainerColor,
      disabledContentColor,
      ...props
    }: IconButtonProps<T>,
    ref: ForwardedRef<T>
  ) => {
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
        ref={ref}
        css={[
          {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: size,
            height: size,
            borderRadius: '2rem',
            color: contentColor,
            backgroundColor: containerColor,
            overflow: 'hidden',
            cursor: 'pointer',
            transition: '.25s',
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
)

export default IconButton
