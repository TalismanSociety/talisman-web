import styled from 'styled-components'
import { 
  Countdown as Cd, 
  Pendor 
} from '@components'
import { 
  useCrowdloanById, 
  useGuardianValue 
} from '@libs/talisman'

const Ongoing = 
  ({
    end,
    showSeconds,
    className
  }) => {
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
    const { crowdloan, end } = useCrowdloanById(id)

    switch (crowdloan?.status) {
      case 'COMPLETED': return <Complete {...rest}/>
      default: return <Ongoing {...rest} end={end}/>
    }
  }

export default Countdown