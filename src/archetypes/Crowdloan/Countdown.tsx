import styled from 'styled-components'
import { Countdown as Cd, Pendor } from '@components'
import { useCrowdloanById, useGuardianValue } from '@libs/talisman'

const Ongoing = 
  ({
    id,
    showSeconds,
    className
  }) => {
    const { end } = useCrowdloanById(id)
    const blockNumber = useGuardianValue('metadata.blockNumber')
    const blockPeriod = useGuardianValue('metadata.blockPeriod')
    return <Pendor
      require={!!end}
      >
      <div
        className={`crowdloan-countdown ongoing ${className}`}
        >
        <Cd 
          showSeconds={showSeconds}
          seconds={(end - blockNumber) * blockPeriod}
        />
      </div>
    </Pendor>
}

const Complete = styled(
  ({
    className
  }) => 
    <span
      className={`crowdloan-countdown complete ${className}`}
      >
      🎉 Complete
    </span>
  )
  `
    display: flex;
    align-items: center;
  `

const Countdown =
  ({
    id,
    showSeconds,
    className,
    ...rest
  }) => {
    const { crowdloan } = useCrowdloanById(id)

    switch (crowdloan?.status) {
      case 'COMPLETE': return <Complete {...rest}/>
      default: return <Ongoing {...rest}/>
    }
  }

export default Countdown