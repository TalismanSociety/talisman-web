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
  const {
    item: { status, lockExpiredBlock, isFinished, wonAuctionId },
  } = useCrowdloanByParachainId(id)

  // TODO: Determine this properly by testing if crowdloan has lease, for example:
  //       https://github.com/polkadot-js/apps/blob/df798fac838715a9b215be82e6e297d3d3f2bc4c/packages/page-parachains/src/useFunds.ts#L44
  const isWinner = status === 'winner'

  // TODO: Determine active / ended properly by testing isCapped || isEnded || isWinner and currentPeriod vs firstSlot:
  //       https://github.com/polkadot-js/apps/blob/df798fac838715a9b215be82e6e297d3d3f2bc4c/packages/page-parachains/src/Crowdloan/Funds.tsx#L30
  const isEnded = status === 'ended'

  if (isWinner) return <Generic text="🎉 Winner" />
  if (isEnded) return <Generic text="Ended" />

  return <Ongoing {...rest} showSeconds={showSeconds} end={lockExpiredBlock} />
}

export default Countdown
