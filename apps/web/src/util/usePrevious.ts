import { useEffect, useRef } from 'react'

const usePrevious = <T>(value: T): T => {
  const ref = useRef<T>() as any

  useEffect(() => {
    if (value !== ref.current) {
      ref.current = value
    }
  }, [value])

  return ref.current
}

export default usePrevious
