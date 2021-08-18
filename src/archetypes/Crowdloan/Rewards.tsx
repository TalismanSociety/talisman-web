import { Stat } from '@components'
import { useCrowdloanByParachainId } from '@libs/talisman'
import styled from 'styled-components'

const Countdown = styled(({ id, className }) => {
  const { rewards, ...rest } = useCrowdloanByParachainId(id)

  return (
    <div className={`crowdloan-rewards ${className}`}>
      {rewards?.tokens?.map(({ symbol, perKSM }) => (
        <Stat title={`${symbol} per KSM`}>{perKSM}</Stat>
      ))}
      {rewards?.custom?.map(({ title, value }) => (
        <Stat title={title}>{value}</Stat>
      ))}

      {rewards?.info && (
        <>
          <hr />
          <p dangerouslySetInnerHTML={{ __html: rewards?.info }}></p>
        </>
      )}
    </div>
  )
})`
  padding: 2.2rem 2.4rem;

  > .stat & + .stat {
    margin-top: 0.7rem;
  }

  > hr {
    margin: 1em 0;
  }

  > p {
    font-size: 0.8em;
    opacity: 0.8;

    &:last-child {
      margin-bottom: 0;
    }
  }
`

export default Countdown
