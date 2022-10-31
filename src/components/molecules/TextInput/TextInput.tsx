import Text from '@components/atoms/Text'
import { useTheme } from '@emotion/react'
import { ReactNode, useId } from 'react'

export type TextInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  type?: 'text' | 'number'
  leadingLabel?: ReactNode
  trailingLabel?: ReactNode
  trailingIcon?: ReactNode
  trailingSupportingText?: ReactNode
  leadingSupportingText?: ReactNode
  isError?: boolean
}

const TextInput = (props: TextInputProps) => {
  const theme = useTheme()
  const inputId = useId()

  return (
    <div>
      {(props.leadingLabel || props.trailingLabel) && (
        <div
          css={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '1.12rem',
            marginBottom: '0.8rem',
          }}
        >
          <Text as="label" htmlFor={inputId}>
            {props.leadingLabel}
          </Text>
          <div>
            <Text>{props.trailingLabel}</Text>
          </div>
        </div>
      )}
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          padding: '1.5rem',
          borderRadius: '1.25rem',
          backgroundColor: theme.color.foreground,
        }}
      >
        <input
          {...props}
          id={inputId}
          css={{
            'flex': 1,
            'fontSize': '3rem',
            'width': '26rem',
            'background': 'transparent',
            'border': 'none',
            '&[type=number]': {
              '::-webkit-outer-spin-button': { display: 'none' },
              '::-webkit-inner-spin-button': { display: 'none' },
              '-moz-appearance': 'textfield',
            },
          }}
        />
        {props.trailingIcon}
      </div>
      <div
        css={{
          'display': 'flex',
          'justifyContent': 'space-between',
          'alignItems': 'center',
          'fontSize': '1.12rem',
          'marginTop': '0.8rem',
          '> *:empty::after': {
            content: `"\u200B"`,
          },
        }}
      >
        <Text as="label">{props.leadingSupportingText}</Text>
        <Text as="label" css={props.isError && { color: theme.color.error }}>
          {props.trailingSupportingText}
        </Text>
      </div>
    </div>
  )
}

export type LabelButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

export const LabelButton = (props: LabelButtonProps) => {
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
}

export default TextInput
