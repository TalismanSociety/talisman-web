import type { ReactNode } from 'react'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'

import { Countdown as Cd } from '@/components/legacy/Countdown'
import { Pendor } from '@/components/legacy/Pendor'
import { useChainmetaValue, useCrowdloanById } from '@/libs/talisman'

type OngoingProps = {
  end?: number
  showSeconds?: boolean
  className?: string
  relayChainId?: number
}

const Ongoing = ({ end, showSeconds, relayChainId, className = '' }: OngoingProps) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>()
  const blockNumber = useChainmetaValue(relayChainId!, 'blockNumber')
  const blockPeriod = useChainmetaValue(relayChainId!, 'blockPeriod')

  useEffect(() => {
    if (!end || !blockNumber || !blockPeriod) return
    setSecondsRemaining((end - blockNumber) * blockPeriod)
  }, [end, blockNumber, blockPeriod])

  return (
    <Pendor require={!!secondsRemaining}>
      <div className={`crowdloan-countdown ongoing ${className}`}>
        <Cd showSeconds={Boolean(showSeconds)} seconds={secondsRemaining ?? 0} />
      </div>
    </Pendor>
  )
}

const Generic = styled(({ text, className }: { className?: string; text: ReactNode }) => (
  <span className={`crowdloan-countdown finished ${className ?? ''}`}>{text}</span>
))`
  display: flex;
  align-items: center;
`

type CountdownProps = {
  id?: string
  end?: number
  showSeconds?: boolean
  className?: string
}

export const CrowdloanCountdown = ({ id, showSeconds, className, ...rest }: CountdownProps) => {
  const { crowdloan } = useCrowdloanById(id)

  // Pendor
  if (!crowdloan) return <Ongoing />

  const { uiStatus, end } = crowdloan

  if (['active', 'capped'].includes(uiStatus)) {
    return <Ongoing {...rest} showSeconds={showSeconds} end={end} relayChainId={crowdloan?.relayChainId} />
  }
  if (uiStatus === 'winner') return <Generic text="Winner" />
  if (uiStatus === 'ended') return <Generic text="Ended" />

  // Pendor
  return <Ongoing />
}
