import { useTheme } from '@emotion/react'
import type { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from 'react'

import { Text } from '../../atoms'

export type DateInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  leadingLabel?: ReactNode
}

const DateInput = ({ leadingLabel, ...props }: DateInputProps) => {
  const theme = useTheme()

  return (
    <label>
      {leadingLabel && (
        <Text.Body as="div" css={{ fontSize: '1.12rem', marginBottom: '0.8rem' }}>
          {leadingLabel}
        </Text.Body>
      )}
      <input
        {...props}
        type="date"
        css={{
          outline: 'none',
          border: 'none',
          padding: '1.6rem',
          borderRadius: '0.8rem',
          backgroundColor: theme.color.foreground,
          colorScheme: 'dark',
        }}
      />
    </label>
  )
}

export default DateInput
