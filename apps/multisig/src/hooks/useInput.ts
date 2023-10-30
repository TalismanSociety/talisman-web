import { useCallback, useState } from 'react'

export const useInput = (initialValue: string) => {
  const [value, setValue] = useState(initialValue)
  const onChange = useCallback((e: string | React.ChangeEvent<HTMLInputElement>) => {
    setValue(typeof e === 'string' ? e : e.target.value)
  }, [])
  return { value, onChange }
}
