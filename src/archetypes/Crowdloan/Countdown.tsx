import { Countdown as Cd, Pendor } from '@components'
import { useCrowdloanByParachainId, useGuardianValue } from '@libs/talisman'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

type OngoingProps = {
  end?: number
  showSeconds?: boolean
  className?: string
}

const Ongoing: React.FC<OngoingProps> = ({ end, showSeconds, className = '' }) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>()
  const blockNumber = useGuardianValue('metadata.blockNumber')
  const blockPeriod = useGuardianValue('metadata.blockPeriod')

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

const Complete = styled(({ className }) => (
  <span className={`crowdloan-countdown complete ${className}`}>🎉 Complete</span>
))`
  display: flex;
  align-items: center;
`

const Generic = styled(({ text, className }) => (
  <span className={`crowdloan-countdown finished ${className}`}>{text}</span>
))`
  display: flex;
  align-items: center;
`

type CountdownProps = {
  id: number
  end?: number
  showSeconds?: boolean
  className?: string
}

const Countdown: React.FC<CountdownProps> = ({ id, showSeconds, className, ...rest }) => {
  const { status, lockExpiredBlock } = useCrowdloanByParachainId(id)

  switch (status) {
    case 'Won':
      return <Complete />
    case 'Retiring':
      return <Generic text="Finished" />
    case 'Dissolved':
      return <Generic text="Dissolved" />
    default:
      return <Ongoing {...rest} showSeconds={showSeconds} end={lockExpiredBlock} />
  }
}

export default Countdown
