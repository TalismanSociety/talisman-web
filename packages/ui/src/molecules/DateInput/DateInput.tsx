import { useEffect, useState, type DetailedHTMLProps, type InputHTMLAttributes, useMemo } from 'react'
import { Surface } from '../../atoms'

const parseDate = (date: Date | string | undefined) => {
  if (date instanceof Date) {
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return date
}

export type DateInputProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'value' | 'min' | 'max'
> & {
  value?: string | Date
  min?: string | Date
  max?: string | Date
  onChangeDate?: (date: Date | undefined) => unknown
}

// TODO: this is currently an uncontrolled component
// passed value will only be used as initial value
const DateInput = (props: DateInputProps) => {
  const [dateString, setDateString] = useState<string>(() => parseDate(props.value) ?? '')

  const date = useMemo(() => new Date(dateString), [dateString])

  useEffect(
    () => {
      if (dateString === '' || dateString === undefined) {
        props.onChangeDate?.(undefined)
      }

      if (dateString?.match(/^\d{4}-\d{2}-\d{2}$/) && parseInt(dateString.slice(0, 4)) >= 1000) {
        props.onChangeDate?.(date)
      }
    },
    // Can enter infinite loop if unstable deps is passed
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [date]
  )

  useEffect(
    () => {
      if (props.min !== undefined && date < new Date(props.min)) {
        setDateString(parseDate(props.min) ?? '')
      }

      if (props.max !== undefined && date > new Date(props.max)) {
        setDateString(parseDate(props.max) ?? '')
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [date, props.max?.toString(), props.min?.toString()]
  )

  return (
    // @ts-expect-error
    <Surface
      as="input"
      {...props}
      value={dateString}
      min={parseDate(props.min)}
      max={parseDate(props.max)}
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
