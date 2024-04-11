import { Stat } from '@components'
import styled from '@emotion/styled'
import { useCrowdloanById } from '@libs/talisman'

const Rewards = styled(({ id, className }: { id?: string; className?: string }) => {
  const { crowdloan } = useCrowdloanById(id)
  const details = crowdloan?.details

  return (
    <div className={`crowdloan-rewards ${className ?? ''}`}>
      {details?.rewards?.tokens && (
        <Stat
          title={`${details?.token} per ${
            details?.relayId === '0' ? 'DOT' : details?.relayId === '2' ? 'KSM' : 'Unknown'
          }`}
        >
          {details?.rewards?.tokens}
        </Stat>
      )}
      {details?.customRewards?.map(({ title, value }, index) => (
        <Stat key={index} title={title}>
          {value}
        </Stat>
      ))}
      {details?.rewards?.info && (
        <>
          <hr />
          <p dangerouslySetInnerHTML={{ __html: details?.rewards?.info }}></p>
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

export default Rewards
