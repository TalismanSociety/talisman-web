import { useEffect, useState, type DetailedHTMLProps, type InputHTMLAttributes } from 'react'
import { Surface } from '../../atoms'

export type DateInputProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'value'
> & {
  value?: string | Date
  onChangeDate?: (date: Date | undefined) => unknown
}

// TODO: this is currently an uncontrolled component
// passed value will only be used as initial value
const DateInput = (props: DateInputProps) => {
  const [dateString, setDateString] = useState<string>(() => {
    if (props.value instanceof Date) {
      const year = props.value.getFullYear().toString()
      const month = (props.value.getMonth() + 1).toString().padStart(2, '0')
      const day = props.value.getDate().toString().padStart(2, '0')
      return `${year}-${month}-${day}`
    } else {
      return props.value ?? ''
    }
  })

  useEffect(
    () => {
      if (dateString === '' || dateString === undefined) {
        props.onChangeDate?.(undefined)
      }

      if (dateString?.match(/^\d{4}-\d{2}-\d{2}$/) && parseInt(dateString.slice(0, 4)) >= 1000) {
        props.onChangeDate?.(new Date(dateString))
      }
    },
    // Can enter infinite loop if unstable deps is passed
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateString]
  )

  return (
    // @ts-expect-error
    <Surface
      as="input"
      {...props}
      value={dateString}
      type="date"
      onChange={event => {
        props.onChange?.(event)
        setDateString(event.target.value)
      }}
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
