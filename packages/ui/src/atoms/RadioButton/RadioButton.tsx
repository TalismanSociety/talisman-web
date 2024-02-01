import { useTheme } from '@emotion/react'
import type { DetailedHTMLProps, InputHTMLAttributes } from 'react'
import { Surface } from '..'

export type RadioButtonProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const RadioButton = (props: RadioButtonProps) => {
  const theme = useTheme()
  return (
    <Surface
      as="input"
      type="radio"
      checked={props.checked}
      css={{
        'appearance': 'none',
        'display': 'inline-flex',
        'borderRadius': '0.8rem',
        'width': '1.6rem',
        'height': '1.6rem',
        ':checked': {
          ':before': {
            content: '""',
            display: 'block',
            margin: 'auto',
            width: '0.8rem',
            height: '0.8rem',
            borderRadius: '0.4rem',
            backgroundColor: theme.color.primary,
          },
        },
      }}
    />
  )
}

export default RadioButton
