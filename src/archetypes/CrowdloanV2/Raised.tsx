import { Pendor, ProgressBar, Stat } from '@components'
import { useCrowdloanById } from '@libs/talisman'
import { shortNumber } from '@util/helpers'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const Raised = styled(({ id, title, className }) => {
  const { crowdloan: { percentRaised, raised, cap, uiStatus } = {} } = useCrowdloanById(id)
  const { t } = useTranslation()
  return (
    <div className={`crowdloan-raised ${className}`} data-status={uiStatus?.toLowerCase()}>
      {uiStatus === 'capped' && <h3>{t('Goal reached')} ✓</h3>}
      {uiStatus !== 'capped' && title && <h3>{title}</h3>}

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
    color: var(--color-text);
    margin-top: 0.7rem;
  }

  &[data-status='capped'] h3 {
    color: var(--color-status-success);
    opacity: 0.9;
  }
  &[data-status='capped'] > .progress-bar {
    opacity: 0.6;
  }

  &[data-status='winner'] {
    opacity: 0.6;
  }
`

export default Raised
