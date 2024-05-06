import { useEffect, useMemo, useRef, useState } from 'react'

export const useInterval = (cb = () => {}, ms = 1000) => {
  const savedCallback = useRef<() => void>()
  const [id, setId] = useState<NodeJS.Timer | null>(null)

  useEffect(() => {
    savedCallback.current = cb
  }, [cb])

  useEffect(() => {
    const tick = () => typeof savedCallback?.current !== 'undefined' && savedCallback?.current()
    const _id = setInterval(tick, ms)
    setId(_id)
    return () => clearInterval(_id)
  }, [ms])

  return id
}

const useCountdown = (seconds = 0) => {
  const [secondsRemaining, setSecondsRemaining] = useState(Math.max(0, seconds))

  useEffect(() => {
    setSecondsRemaining(Math.max(0, seconds))
  }, [seconds])

  useInterval(() => setSecondsRemaining(Math.max(0, secondsRemaining - 1)))

  return useMemo(() => secondsRemaining, [secondsRemaining])
}

const minute = 60
const hour = 60 * minute
const day = 24 * hour
const week = 7 * day

const Countdown = ({
  seconds: countdownSeconds = 10,
  showSeconds = true,
}: {
  seconds: number
  showSeconds: boolean
}) => {
  const remaining = useCountdown(countdownSeconds)

  const weeks = Math.max(0, Math.floor(remaining / week))
  const weeksRemainder = remaining % week

  const days = Math.max(0, Math.floor(weeksRemainder / day))
  const daysRemainder = weeksRemainder % day

  const hours = Math.max(0, Math.floor(daysRemainder / hour))
  const hoursRemainder = daysRemainder % hour

  const minutes = Math.max(0, Math.floor(hoursRemainder / minute))
  const seconds = hoursRemainder % minute

  const segments = [
    weeks > 0 && `${weeks}w`,
    days > 0 && `${days}d`,
    `${hours}h`,
    `${minutes.toString().padStart(2, '0')}m`,
    showSeconds && seconds > 0 && `${seconds}s`,
  ].filter(Boolean)

  return <>{segments.join(' ')}</>
}

export default Countdown
