import { useTheme } from '@emotion/react'
import type { DetailedHTMLProps, InputHTMLAttributes } from 'react'
import { Surface, useSurfaceColor } from '..'

export type SwitchProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Switch = (props: SwitchProps) => {
  const theme = useTheme()
  return (
    <Surface
      as="label"
      elevation={x => x + 3}
      css={[
        {
          display: 'inline-flex',
          width: '3.3rem',
          borderRadius: 'calc(1.8rem / 2)',
          padding: '0.2rem',
          cursor: 'pointer',
          ':has(input:checked)': {
            '> div': {
              backgroundColor: theme.color.primary,
              transform: 'translateX(100%)',
            },
          },
        },
      ]}
    >
      <input {...props} type="checkbox" css={{ display: 'none' }} />
      <div
        css={{
          width: '1.5rem',
          height: '1.5rem',
          borderRadius: 'calc(1.5rem / 2)',
          backgroundColor: useSurfaceColor(),
          transition: 'linear 0.125s',
        }}
      />
    </Surface>
  )
}

export default Switch
