import { Pendor, ProgressBar, Stat } from '@components'
import { useCrowdloanById } from '@libs/talisman'
import { shortNumber } from '@util/helpers'
import styled from 'styled-components'

const Raised = styled(({ id, title, className }) => {
  const { crowdloan: { percentRaised, raised, cap, status } = {} } = useCrowdloanById(id)

  return (
    <div className={`crowdloan-raised ${className}`} data-status={status?.toLowerCase()}>
      {title && <h3>{title}</h3>}

      <ProgressBar percent={percentRaised} />

      <Stat
        title={
          <Pendor suffix=" KSM" require={!!raised && !!cap}>
            {shortNumber(raised)} / {shortNumber(cap)}
          </Pendor>
        }
      >
        <Pendor suffix="%" require={!!percentRaised}>
          {percentRaised?.toFixed(2)}
        </Pendor>
      </Stat>
    </div>
  )
})`
  h3 {
    font-size: var(--font-size-small);
    opacity: 0.4;
    margin-bottom: 0.5em;
  }

  > .stat {
    margin-top: 0.7rem;
  }

  &[data-status='won'] {
    opacity: 0.6;
  }
`

export default Raised
