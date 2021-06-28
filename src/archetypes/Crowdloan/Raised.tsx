import styled from 'styled-components'
import { useCrowdloan } from '@libs/talisman'
import { Pendor } from '@components'
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
    } = useCrowdloan(id)

    return <div
      className={`crowdloan-raised ${className}`}
      >
      <div
        className='bar'
        >
        <span style={{width: `${percentRaised||0}%`}}/>
      </div>
      <div
        className='text'
        >
        <span>
          <Pendor
            suffix=' KSM'
            require={!!raised && !!cap}
            >
            {shortNumber(raised)} / {shortNumber(cap)}
          </Pendor>
        </span>
        <span>
          <Pendor
            suffix='%'
            require={percentRaised}
            >
            {percentRaised?.toFixed(2)}
          </Pendor>
        </span>
      </div>
    </div>
  })
  `
    .bar{
      display: block;
      height: 1em;
      margin-top: 1em;
      border-radius: 0.5em;
      position: relative;
      overflow: hidden;
      background: rgb(${({ theme }) => theme.foreground}, 0.1);
      color: rgb(${({ theme }) => theme.foreground});

      >span{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 1em;
        background: rgba(${({ theme }) => theme.foreground}, 0.1);
        transition: all 0.3s ease-out;
      }
    }

    .text{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  `

export default Countdown