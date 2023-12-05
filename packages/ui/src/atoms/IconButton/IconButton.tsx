import { type ElementType } from 'react'
import type { IconProps } from '../Icon'
import Icon, { SurfaceIcon, TonalIcon } from '../Icon'
import { useTheme } from '@emotion/react'

type IconButtonElementType = Extract<ElementType, 'button' | 'a' | 'figure'> | ElementType<any>

export type IconButtonProps<T extends IconButtonElementType = 'button'> = IconProps<T> & {
  disabledContainerColor?: string
  disabledContentColor?: string
}

const BaseIconButtonFactory =
  (Element: any) =>
  <T extends IconButtonElementType = 'button'>(props: IconButtonProps<T>) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const theme = useTheme()
    return (
      <Element
        {...props}
        css={[
          props['onClick'] !== undefined && {
            'cursor': 'pointer',
            ':hover': {
              filter: 'brightness(1.2)',
            },
          },
          props.disabled && {
            opacity: theme.contentAlpha.disabled,
            color: props.disabledContentColor,
            backgroundColor: props.disabledContainerColor,
            cursor: 'not-allowed',
          },
        ]}
      />
    )
  }

const IconButton = BaseIconButtonFactory(Icon)

export const TonalIconButton = BaseIconButtonFactory(TonalIcon)

export const SurfaceIconButton = BaseIconButtonFactory(SurfaceIcon)

export default IconButton
