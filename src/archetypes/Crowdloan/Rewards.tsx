import styled from 'styled-components'
import { useCrowdloanById } from '@libs/talisman'
import { Stat } from '@components'

const Countdown = styled(
  ({
    id,
    className
  }) => {
    const { 
      crowdloan
    } = useCrowdloanById(id)

    return <div
      className={`crowdloan-rewards ${className}`}
      >
      {crowdloan?.rewards?.tokens?.map(({symbol, perKSM}) => <Stat title={`${symbol} per KSM`}>{perKSM}</Stat>)}
      {crowdloan?.rewards?.custom?.map(({title, value}) => <Stat title={title}>{value}</Stat>)}
      
      {crowdloan?.rewards?.info && 
        <>
          <hr/>
          <p dangerouslySetInnerHTML={{__html: crowdloan?.rewards?.info}}></p>
        </>
      }
    </div>
  })
  `
    >.stat & + .stat{
      margin-top: 0.7rem;
    }

    >hr{
      margin: 1em 0
    }

    >p{
      font-size: 0.8em;
      opacity: 0.8;

      &:last-child{
        margin-bottom: 0;
      }
    }
  `

export default Countdown