import type { PropsWithChildren, ReactNode } from 'react'
import { useTheme } from '@emotion/react'
import { useId } from 'react'

import { Surface } from '../atoms/Surface'
import { Text } from '../atoms/Text'

export type ContainedTextInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  type?: 'text' | 'number'
  leadingLabel?: ReactNode
  trailingLabel?: ReactNode
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  /**
   * Ensure placeholder space
   */
  hasSupportingText?: boolean
  trailingSupportingText?: ReactNode
  leadingSupportingText?: ReactNode
}

export const ContainedTextInput = Object.assign(
  ({
    leadingLabel,
    trailingLabel,
    leadingIcon,
    trailingIcon,
    hasSupportingText,
    trailingSupportingText,
    leadingSupportingText,
    width,
    ...props
  }: ContainedTextInputProps) => {
    const theme = useTheme()
    const inputId = useId()

    return (
      <Surface
        css={{
          padding: '1.5rem',
          borderRadius: theme.shape.medium,
          width,
        }}
      >
        {(leadingLabel || trailingLabel) && (
          <div
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
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
        <div
          css={{
            display: 'flex',
            alignItems: 'center',
            margin: '1.6rem 0',
          }}
        >
          {leadingIcon}
          <Text.BodyLarge
            {...props}
            as="input"
            id={inputId}
            alpha="high"
            css={{
              flex: 1,
              // If container width is defined set width to 0 to expand with flex
              width: width !== undefined ? 0 : '20rem',
              border: 'none',
              background: 'transparent',
              fontSize: '3.2rem',
              textAlign: 'end',
              '&[type=number]': {
                '::-webkit-outer-spin-button': { display: 'none' },
                '::-webkit-inner-spin-button': { display: 'none' },
                MozAppearance: 'textfield',
              },
            }}
          />
          {trailingIcon}
        </div>
        {(hasSupportingText || leadingSupportingText || trailingSupportingText) && (
          <div
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              '> *:empty::after': {
                content: `"\u200B"`,
              },
            }}
          >
            <Text.BodySmall as="label" htmlFor={inputId}>
              {leadingSupportingText}
            </Text.BodySmall>
            <Text.BodySmall as="label" htmlFor={inputId}>
              {trailingSupportingText}
            </Text.BodySmall>
          </div>
        )}
      </Surface>
    )
  },
  {
    ErrorLabel: (props: PropsWithChildren) => (
      <Text.BodySmall css={theme => ({ color: theme.color.onError })} {...props} />
    ),
  }
)
