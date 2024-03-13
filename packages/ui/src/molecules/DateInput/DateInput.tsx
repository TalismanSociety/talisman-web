import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEventHandler,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
} from 'react'
import { Text, useSurfaceColor } from '../../atoms'
import { useTheme } from '@emotion/react'

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
  const theme = useTheme()

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
    <Text.Body
      as="input"
      {...props}
      value={dateString}
      min={parseDate(props.min)}
      max={parseDate(props.max)}
      type="date"
      onChange={useCallback<ChangeEventHandler<HTMLInputElement>>(
        event => {
          props.onChange?.(event)
          setDateString(event.target.value)
        },
        [props]
      )}
      css={{
        background: useSurfaceColor(),
        outline: 'none',
        border: 'none',
        padding: '1.6rem',
        borderRadius: theme.shape.small,
        colorScheme: 'dark',
      }}
    />
  )
}

export default DateInput
