import { useMemo, type DetailedHTMLProps, type InputHTMLAttributes, type ReactNode } from 'react'

import { Surface, Text } from '../../atoms'

export type DateInputProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'value'
> & {
  value?: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>['value'] | Date
  leadingLabel?: ReactNode
}

const DateInput = ({ leadingLabel, ...props }: DateInputProps) => {
  const value = useMemo(() => {
    if (props.value instanceof Date) {
      try {
        return props.value.toISOString().split('T')[0]
      } catch {
        return undefined
      }
    }

    return props.value
  }, [props.value])

  return (
    <label>
      {leadingLabel && (
        <Text.Body as="div" css={{ fontSize: '1.12rem', marginBottom: '0.8rem' }}>
          {leadingLabel}
        </Text.Body>
      )}
      {/* @ts-expect-error */}
      <Surface
        as="input"
        {...props}
        value={value}
        type="date"
        css={{
          outline: 'none',
          border: 'none',
          padding: '1.6rem',
          borderRadius: '0.8rem',
          colorScheme: 'dark',
        }}
      />
    </label>
  )
}

export default DateInput
