import { Countdown as Cd, Pendor } from '@components'
import { useChainmetaValue, useCrowdloanById } from '@libs/talisman'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

type OngoingProps = {
  end?: number
  showSeconds?: boolean
  className?: string
  relayChainId?: number
}

const Ongoing: React.FC<OngoingProps> = ({ end, showSeconds, className = '', relayChainId }) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>()
  const blockNumber = useChainmetaValue(relayChainId, 'blockNumber')
  const blockPeriod = useChainmetaValue(relayChainId, 'blockPeriod')

  useEffect(() => {
    if (!end || !blockNumber || !blockPeriod) return
    setSecondsRemaining((end - blockNumber) * blockPeriod)
  }, [end, blockNumber, blockPeriod])

  return (
    <Pendor require={!!secondsRemaining}>
      <div className={`crowdloan-countdown ongoing ${className}`}>
        <Cd showSeconds={showSeconds} seconds={secondsRemaining} />
      </div>
    </Pendor>
  )
}

const Generic = styled(({ text, className }) => (
  <span className={`crowdloan-countdown finished ${className}`}>{text}</span>
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

const Countdown: React.FC<CountdownProps> = ({ id, showSeconds, className, ...rest }) => {
  const { crowdloan } = useCrowdloanById(id)

  // Pendor
  if (!crowdloan) return <Ongoing relayChainId={crowdloan?.relayChainId} />

  const { uiStatus, lockExpiredBlock } = crowdloan

  if (['active', 'capped'].includes(uiStatus)) {
    return <Ongoing {...rest} showSeconds={showSeconds} end={lockExpiredBlock} relayChainId={crowdloan?.relayChainId} />
  }
  if (uiStatus === 'winner') return <Generic text="Winner" relayChainId={crowdloan?.relayChainId} />
  if (uiStatus === 'ended') return <Generic text="Ended" relayChainId={crowdloan?.relayChainId} />

  // Pendor
  return <Ongoing />
}

export default Countdown
