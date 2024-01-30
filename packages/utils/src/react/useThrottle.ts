// Needed as `useThrottle` from `react-use` doesn't work
// https://github.com/streamich/react-use/issues/2488

import { useEffect, useRef, useState } from 'react'

export const useThrottle = <T>(value: T, limit: number) => {
  const [throttledValue, setThrottledValue] = useState(value)
  const lastRan = useRef(Date.now())

  useEffect(() => {
    const handler = setTimeout(function () {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value)
        lastRan.current = Date.now()
      }
    }, limit - (Date.now() - lastRan.current))

    return () => {
      clearTimeout(handler)
    }
  }, [value, limit])

  return throttledValue
}
