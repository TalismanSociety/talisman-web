import { type ElementType } from 'react'
import type { IconProps } from '../Icon'
import Icon from '../Icon'

type IconButtonElementType = Extract<ElementType, 'button' | 'a' | 'figure'> | ElementType<any>

export type IconButtonProps<T extends IconButtonElementType = 'button'> = IconProps<T> & {
  disabledContainerColor?: string
  disabledContentColor?: string
}

const IconButton = <T extends IconButtonElementType = 'button'>(props: IconButtonProps<T>) => (
  <Icon
    {...props}
    css={[
      props['onClick'] !== undefined && {
        'cursor': 'pointer',
        ':hover': {
          filter: 'brightness(1.2)',
        },
      },
      props.disabled && {
        color: props.disabledContentColor,
        backgroundColor: props.disabledContainerColor,
        cursor: 'not-allowed',
      },
    ]}
  />
)

export default IconButton
