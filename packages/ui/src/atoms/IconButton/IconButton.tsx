import { CircularProgressIndicator } from '..'
import type { IconProps } from '../Icon'
import Icon, { SurfaceIcon, TonalIcon } from '../Icon'
import { useTheme } from '@emotion/react'
import { type ElementType, type PropsWithChildren } from 'react'

type IconButtonElementType = Extract<ElementType, 'button' | 'a' | 'figure'> | ElementType<any>

export type IconButtonProps<T extends IconButtonElementType = 'button'> = PropsWithChildren<
  IconProps<T> & {
    loading?: boolean
    disabledContainerColor?: string
    disabledContentColor?: string
  }
>

const BaseIconButtonFactory =
  (Element: any) =>
  <T extends IconButtonElementType = 'button'>(props: IconButtonProps<T>) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const theme = useTheme()
    return (
      <Element
        as="button"
        {...props}
        css={[
          {
            cursor: 'pointer',
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
      >
        {props.loading ? <CircularProgressIndicator /> : props.children}
      </Element>
    )
  }

const IconButton = BaseIconButtonFactory(Icon)

export const TonalIconButton = BaseIconButtonFactory(TonalIcon)

export const SurfaceIconButton = BaseIconButtonFactory(SurfaceIcon)

export default IconButton
