import styled from 'styled-components'
import { Countdown as Cd, Pendor } from '@components'
import { useCrowdloanById, useGuardianValue } from '@libs/talisman'
import { ReactComponent as CheckIcon } from '@icons/check-circle.svg'

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
      <CheckIcon/>
      <span>Complete</span>
    </span>
  )
  `
    display: flex;
    align-items: center;
    
    >*{
      line-height: 1em;
      display: block;
      color: var(--color-status-success);

      & + *{
        margin-left: 0.3em;
      }
    }
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


    // return <Pendor
    //   require={!!end}
    //   >
    //   <div
    //     className="crowdloan-countdown"
    //     >
    //     {crowdloan?.complete === true
    //       ? 'COMPLETE'
    //       : <Cd 
    //         showSeconds={showSeconds}
    //         seconds={(end - blockNumber) * blockPeriod}
    //       />
    //     }
        
    //   </div>
    // </Pendor>
  }

export default Countdown