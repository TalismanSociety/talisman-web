import { Player, PlayerEvent } from '@lottiefiles/react-lottie-player'
import { useEffect, useMemo, useState } from 'react'

import fulfilled from './fulfilled.json'
import pending from './pending.json'
import rejected from './rejected.json'

export type EyeOfSauronProgressIndicatorProps = {
  state?: 'pending' | 'fulfilled' | 'rejected'
  size?: number | string
}

const EyeOfSauronProgressIndicator = (props: EyeOfSauronProgressIndicatorProps) => {
  const [state, setState] = useState(props.state ?? 'pending')
  const [lastEvent, setLastEvent] = useState<PlayerEvent>()

  useEffect(() => {
    if (lastEvent === PlayerEvent.Complete) {
      setState(props.state ?? 'pending')
    }
  }, [lastEvent, props.state])

  return (
    <Player
      autoplay
      keepLastFrame
      loop={state === 'pending'}
      src={useMemo(() => {
        switch (state) {
          case 'pending':
            return pending
          case 'fulfilled':
            return fulfilled
          case 'rejected':
            return rejected
        }
      }, [state])}
      onEvent={event => {
        setLastEvent(event)
        if (event === PlayerEvent.Complete || event === PlayerEvent.Loop) {
          setState(props.state ?? 'pending')
        }
      }}
      speed={1.3}
      css={{ width: props.size ?? '14rem', height: props.size ?? '14rem' }}
    />
  )
}

export default EyeOfSauronProgressIndicator
