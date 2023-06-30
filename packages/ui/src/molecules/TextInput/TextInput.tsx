import { useTheme } from '@emotion/react'
import { useId, type ButtonHTMLAttributes, type DetailedHTMLProps, type PropsWithChildren, type ReactNode } from 'react'
import { Text, Surface } from '../../atoms'

export type TextInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  type?: 'text' | 'number'
  leadingLabel?: ReactNode
  trailingLabel?: ReactNode
  trailingIcon?: ReactNode
  trailingSupportingText?: ReactNode
  leadingSupportingText?: ReactNode
  containerClassName?: string
  /** @deprecated */
  isError?: boolean
}

const TextInput = Object.assign(
  ({
    leadingLabel,
    trailingLabel,
    trailingIcon,
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
        {(leadingLabel || trailingLabel) && (
          <div
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.8rem',
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
          }}
        >
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
        {(leadingSupportingText || trailingSupportingText) && (
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
    LabelButton: (props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => {
      const theme = useTheme()
      return (
        <button
          {...props}
          css={{
            'padding': '0.5rem',
            'border': 'none',
            'borderRadius': '1rem',
            'background': theme.color.foregroundVariant,
            'cursor': 'pointer',
            ':hover': {
              filter: 'brightness(1.4)',
            },
          }}
        />
      )
    },
  }
)

export default TextInput
