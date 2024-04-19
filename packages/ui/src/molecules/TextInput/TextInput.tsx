import { useTheme } from '@emotion/react'
import {
  useId,
  type ButtonHTMLAttributes,
  type DetailedHTMLProps,
  type PropsWithChildren,
  type ReactNode,
  type ChangeEvent,
  forwardRef,
} from 'react'
import { Clickable, Surface, Text, useSurfaceColorAtElevation } from '../../atoms'

export type TextInputProps = Omit<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'ref'
> & {
  type?: 'text' | 'number'
  hasLabel?: ReactNode
  leadingLabel?: ReactNode
  leadingIcon?: ReactNode
  trailingLabel?: ReactNode
  trailingIcon?: ReactNode
  hasSupportingText?: boolean
  trailingSupportingText?: ReactNode
  leadingSupportingText?: ReactNode
  containerClassName?: string
  inputContainerClassName?: string
  onChangeText?: (value: string) => unknown
  /** @deprecated */
  isError?: boolean
}

const TextInput = Object.assign(
  forwardRef<HTMLInputElement, TextInputProps>(
    (
      {
        hasLabel,
        leadingLabel,
        leadingIcon,
        trailingLabel,
        trailingIcon,
        hasSupportingText,
        trailingSupportingText,
        leadingSupportingText,
        containerClassName,
        inputContainerClassName,
        onChangeText,
        isError,
        ...props
      },
      ref
    ) => {
      const theme = useTheme()
      const inputId = useId()

      return (
        <div className={containerClassName}>
          {(hasLabel || leadingLabel || trailingLabel) && (
            <div
              css={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.8rem',
                '*:empty::after': {
                  content: `"\u200B"`,
                },
              }}
            >
              <Text.BodySmall as="label" htmlFor={inputId}>
                {leadingLabel}
              </Text.BodySmall>
              <Text.BodySmall as="label" htmlFor={inputId}>
                {trailingLabel}
              </Text.BodySmall>
            </div>
          )}
          <Surface
            className={inputContainerClassName}
            css={{
              color: theme.color.onSurface,
              display: 'flex',
              alignItems: 'center',
              padding: '1.156rem 1.5rem',
              borderRadius: theme.shape.medium,
              gap: '1rem',
            }}
          >
            {leadingIcon}
            <input
              ref={ref}
              {...props}
              id={inputId}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                props.onChange?.(event)
                onChangeText?.(event.target.value)
              }}
              css={[
                theme.typography.body,
                {
                  color: theme.color.onSurface,
                  flex: 1,
                  width: props.width ?? '20rem',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  '&[type=number]': {
                    '::-webkit-outer-spin-button': { display: 'none' },
                    '::-webkit-inner-spin-button': { display: 'none' },
                    '-moz-appearance': 'textfield',
                  },
                  outline: 'none',
                },
              ]}
            />
            {trailingIcon}
          </Surface>
          {(hasSupportingText || leadingSupportingText || trailingSupportingText) && (
            <div
              css={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0.8rem',
                '*:empty::after': {
                  content: `"\u200B"`,
                },
              }}
            >
              <Text.BodySmall as="label" htmlFor={inputId}>
                {leadingSupportingText}
              </Text.BodySmall>
              <Text.BodySmall as="label" htmlFor={inputId} css={isError && { color: theme.color.onErrorContainer }}>
                {trailingSupportingText}
              </Text.BodySmall>
            </div>
          )}
        </div>
      )
    }
  ),
  {
    ErrorLabel: (props: PropsWithChildren) => (
      <Text.BodySmall css={theme => ({ color: theme.color.onErrorContainer })} {...props} />
    ),
    LabelButton: (props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => {
      const theme = useTheme()
      return (
        <Clickable.WithFeedback
          {...props}
          css={{
            padding: '0.6rem 1.6rem',
            border: `1px solid ${useSurfaceColorAtElevation(x => x + 8)}`,
            borderRadius: theme.shape.full,
            cursor: 'pointer',
            ':hover': {
              filter: 'brightness(1.4)',
            },
          }}
        >
          <Text.BodyLarge css={{ display: 'contents' }}>{props.children}</Text.BodyLarge>
        </Clickable.WithFeedback>
      )
    },
  }
)

export default TextInput
