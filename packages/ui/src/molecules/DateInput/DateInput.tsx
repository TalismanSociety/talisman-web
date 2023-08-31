import { useMemo, type DetailedHTMLProps, type InputHTMLAttributes } from 'react'

import { Surface } from '../../atoms'

export type DateInputProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'value'
> & {
  value?: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>['value'] | Date
}

const DateInput = (props: DateInputProps) => {
  const value = useMemo(() => {
    if (props.value instanceof Date) {
      try {
        const year = props.value.getFullYear().toString()
        const month = (props.value.getMonth() + 1).toString().padStart(2, '0')
        const day = props.value.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
      } catch {
        return undefined
      }
    }

    return props.value
  }, [props.value])

  return (
    // @ts-expect-error
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
  )
}

export default DateInput
