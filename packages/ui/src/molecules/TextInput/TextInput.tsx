import { useTheme } from '@emotion/react'
import { useId, type ButtonHTMLAttributes, type DetailedHTMLProps, type PropsWithChildren, type ReactNode } from 'react'
import { Clickable, Surface, Text, useSurfaceColorAtElevation } from '../../atoms'

export type TextInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
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
  /** @deprecated */
  isError?: boolean
}

const TextInput = Object.assign(
  ({
    hasLabel,
    leadingLabel,
    leadingIcon,
    trailingLabel,
    trailingIcon,
    hasSupportingText,
    trailingSupportingText,
    leadingSupportingText,
    containerClassName,
    isError,
    ...props
  }: TextInputProps) => {
    const theme = useTheme()
    const inputId = useId()

    return (
      <div className={containerClassName}>
        {(hasLabel || leadingLabel || trailingLabel) && (
          <div
            css={{
              'display': 'flex',
              'justifyContent': 'space-between',
              'alignItems': 'center',
              'marginBottom': '0.8rem',
              '> *:empty::after': {
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
          css={{
            display: 'flex',
            alignItems: 'center',
            padding: '1.5rem',
            borderRadius: '1.25rem',
            gap: '1rem',
          }}
        >
          {leadingIcon}
          <Text.Body
            {...props}
            as="input"
            id={inputId}
            css={{
              'flex': 1,
              'width': props.width ?? '20rem',
              'background': 'transparent',
              'border': 'none',
              '&[type=number]': {
                '::-webkit-outer-spin-button': { display: 'none' },
                '::-webkit-inner-spin-button': { display: 'none' },
                '-moz-appearance': 'textfield',
              },
            }}
          />
          {trailingIcon}
        </Surface>
        {(hasSupportingText || leadingSupportingText || trailingSupportingText) && (
          <div
            css={{
              'display': 'flex',
              'justifyContent': 'space-between',
              'alignItems': 'center',
              'marginTop': '0.8rem',
              '> *:empty::after': {
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
  },
  {
    ErrorLabel: (props: PropsWithChildren) => (
      <Text.BodySmall color={theme => theme.color.onErrorContainer} {...props} />
    ),
    LabelButton: (props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => (
      <Clickable.WithFeedback
        {...props}
        css={{
          'padding': '0.6rem 1.6rem',
          'border': `1px solid ${useSurfaceColorAtElevation(x => x + 8)}`,
          'borderRadius': '20rem',
          'cursor': 'pointer',
          ':hover': {
            filter: 'brightness(1.4)',
          },
        }}
      >
        <Text.BodyLarge css={{ display: 'contents' }}>{props.children}</Text.BodyLarge>
      </Clickable.WithFeedback>
    ),
  }
)

export default TextInput
