import type { DetailedHTMLProps, InputHTMLAttributes } from 'react'
import { useTheme } from '@emotion/react'

import { Surface } from './Surface'

export type RadioButtonProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export const RadioButton = (props: RadioButtonProps) => {
  const theme = useTheme()
  return (
    <Surface
      as="input"
      type="radio"
      checked={props.checked}
      css={{
        appearance: 'none',
        display: 'inline-flex',
        borderRadius: theme.shape.small,
        width: '1.6rem',
        height: '1.6rem',
        ':checked': {
          ':before': {
            content: '""',
            display: 'block',
            margin: 'auto',
            width: '0.8rem',
            height: '0.8rem',
            borderRadius: theme.shape.extraSmall,
            backgroundColor: theme.color.primary,
          },
        },
      }}
    />
  )
}
