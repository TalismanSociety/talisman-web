import { useState, useEffect } from 'react'
import moment from 'moment'

const Countdown = 
  ({
    seconds,
    onCompletion=()=>{}
  }) => {
    const [end, setEnd] = useState(moment.duration(seconds, 'seconds'))
    //const [remaining, setRemaining] = useState()

    // useEffect(() => {
    //   const interval = setInterval(() => setRemaining(moment().add(seconds, 'seconds').toNow()), 1000)
    //   return () => clearInterval(interval)
    // }, [])

    useEffect(() => {
      setEnd(moment.duration(seconds, 'seconds'))
    }, [seconds])

    return `${end.days()}d ${end.hours()}h ${end.minutes()}m ${end.seconds()}s [todo: updated every second]`
  }
  

export default Countdown