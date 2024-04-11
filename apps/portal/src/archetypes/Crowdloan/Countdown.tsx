import { Countdown as Cd, Pendor } from '@components'
import styled from '@emotion/styled'
import { useChainmetaValue, useCrowdloanById } from '@libs/talisman'
import { type ReactNode, useEffect, useState } from 'react'

type OngoingProps = {
  end?: number
  showSeconds?: boolean
  className?: string
  relayChainId?: number
}

const Ongoing = ({ end, showSeconds, relayChainId, className = '' }: OngoingProps) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const blockNumber = useChainmetaValue(relayChainId!, 'blockNumber')
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

const Countdown = ({ id, showSeconds, className, ...rest }: CountdownProps) => {
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

export default Countdown
