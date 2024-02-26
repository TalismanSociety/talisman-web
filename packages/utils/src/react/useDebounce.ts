import { useState, useEffect } from 'react'

export const useDebounce = <T>(value: T, milliSeconds: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, milliSeconds)

    return () => clearTimeout(handler)
  }, [value, milliSeconds])

  return debouncedValue
}
