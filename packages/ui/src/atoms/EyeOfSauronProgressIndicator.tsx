import { Player, PlayerEvent } from '@lottiefiles/react-lottie-player'
import { useEffect, useMemo, useState } from 'react'

import EyeOfSauronProgressIndicatorFulfilled from '../../assets/EyeOfSauronProgressIndicatorFulfilled.json'
import EyeOfSauronProgressIndicatorPending from '../../assets/EyeOfSauronProgressIndicatorPending.json'
import EyeOfSauronProgressIndicatorRejected from '../../assets/EyeOfSauronProgressIndicatorRejected.json'

export type EyeOfSauronProgressIndicatorProps = {
  state?: 'pending' | 'fulfilled' | 'rejected'
  size?: number | string
}

export const EyeOfSauronProgressIndicator = (props: EyeOfSauronProgressIndicatorProps) => {
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
            return EyeOfSauronProgressIndicatorPending
          case 'fulfilled':
            return EyeOfSauronProgressIndicatorFulfilled
          case 'rejected':
            return EyeOfSauronProgressIndicatorRejected
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
