import { useState, useEffect, useRef, useMemo } from 'react'
import moment from 'moment'

export const useInterval = (cb=()=>{}, ms=1000)  => {
  const savedCallback = useRef()
  const [id, setId] = useState(null)

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

const useCountdown = (seconds=0) => {
  const [secondsRemaining, setSecondsRemaining] = useState(seconds)

  useInterval(() => setSecondsRemaining(secondsRemaining - 1))
  
  useEffect(() => {
    setSecondsRemaining(seconds)
  }, [seconds])

  return useMemo(() => secondsRemaining, [secondsRemaining])
}

const Countdown = 
  ({
    seconds=10,
    onCompletion=()=>{},
    showSeconds=true
  }) => {
    const [duration, setDuration] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: seconds
    }) 
    const remaining = useCountdown(seconds)

    useEffect(() => {
      const _duration = moment.duration(remaining, 'seconds')
      setDuration({
        days: _duration.days(),
        hours: _duration.hours(),
        minutes: _duration.minutes(),
        seconds: _duration.seconds()
      })
    }, [remaining])

    return !!duration 
      ? `
        ${duration.days}d 
        ${duration.hours}h 
        ${duration.minutes}m 
        ${showSeconds === true ? `${duration.seconds}s` : ''}`
      : null
  }
  

export default Countdown