import { useCallback, useState } from 'react'

type TProps = {
  refetchTimeout?: number
}

const useTimeout = ({ refetchTimeout }: TProps = {}) => {
  const [timeoutMs] = useState(refetchTimeout || 10000)
  const [timer, setTimer] = useState<NodeJS.Timer>(setInterval(() => {}, 0))
  const [isRunning, setIsRunning] = useState<boolean>(false)

  // start the timer
  const start = useCallback(
    (cb: () => void, triggerOnMount: true): void => {
      if (!!triggerOnMount) cb()
      const _timer = setInterval(cb, timeoutMs)
      setTimer(_timer)
      setIsRunning(true)
    },
    [timeoutMs]
  )

  // stop and clear the timer
  const clear = useCallback(() => {
    clearInterval(timer)
    setIsRunning(false)
  }, [timer])

  return {
    start,
    clear,
    isRunning,
    timer,
  }
}

export default useTimeout
