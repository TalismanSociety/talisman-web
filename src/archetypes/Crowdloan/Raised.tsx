import styled from 'styled-components'
import { useCrowdloanById } from '@libs/talisman'
import { Pendor, Stat, ProgressBar } from '@components'
import { shortNumber } from '@util/helpers'


const Countdown = styled(
  ({
    id,
    className
  }) => {
    const { 
      percentRaised, 
      raised, 
      cap 
    } = useCrowdloanById(id)

    return <div
      className={`crowdloan-raised ${className}`}
      >
      <ProgressBar
        percent={percentRaised}
      />

      <Stat 
        title={
          <Pendor
            suffix=' KSM'
            require={!!raised && !!cap}
            >
            {shortNumber(raised)} / {shortNumber(cap)}
          </Pendor>
        }
        >
        <Pendor
          suffix='%'
          require={!!percentRaised}
          >
          {percentRaised?.toFixed(2)}
        </Pendor>
      </Stat>

    

    </div>
  })
  `
    >.stat{
      margin-top: 0.7rem;
    }
  `

export default Countdown