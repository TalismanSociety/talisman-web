import { CircularProgressIndicator } from '..'
import type { IconProps } from '../Icon'
import Icon, { SurfaceIcon, TonalIcon } from '../Icon'
import { useTheme } from '@emotion/react'
import { useCallback, useTransition, type ElementType, type PropsWithChildren } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconButtonElementType = Extract<ElementType, 'button' | 'a' | 'figure'> | ElementType<any>

export type IconButtonProps<T extends IconButtonElementType = 'button'> = PropsWithChildren<
  IconProps<T> & {
    loading?: boolean
    disabledContainerColor?: string
    disabledContentColor?: string
    withTransition?: boolean
  }
>

const BaseIconButtonFactory =
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Element: any
  ) =>
  <T extends IconButtonElementType = 'button'>({
    loading: _loading = false,
    disabledContainerColor,
    disabledContentColor,
    withTransition = false,
    ...props
  }: IconButtonProps<T>) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isPending, startTransition] = useTransition()
    const loading = _loading || isPending

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const onClick = useCallback(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (...args: any[]) => {
        if (withTransition) {
          return startTransition(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(props as any).onClick?.(...args)
          })
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (props as any).onClick?.(...args)
        }
      },
      [props, withTransition]
    )

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const theme = useTheme()
    return (
      <Element
        as="button"
        {...props}
        onClick={onClick}
        css={[
          {
            cursor: 'pointer',
            ':hover': {
              filter: 'brightness(1.2)',
            },
          },
          props.disabled && {
            opacity: theme.contentAlpha.disabled,
            color: disabledContentColor,
            backgroundColor: disabledContainerColor,
            cursor: 'not-allowed',
          },
        ]}
      >
        {loading ? <CircularProgressIndicator /> : props.children}
      </Element>
    )
  }

const IconButton = BaseIconButtonFactory(Icon)

export const TonalIconButton = BaseIconButtonFactory(TonalIcon)

export const SurfaceIconButton = BaseIconButtonFactory(SurfaceIcon)

export default IconButton
