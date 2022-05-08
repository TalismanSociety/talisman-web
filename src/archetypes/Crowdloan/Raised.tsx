import { ReactComponent as CheckCircleIcon } from '@assets/icons/check-circle.svg'
import { Pendor, ProgressBar, Stat } from '@components'
import { getTotalContributionForCrowdloan, useCrowdloanContributions } from '@libs/crowdloans'
import { useAccountAddresses, useCrowdloanById } from '@libs/talisman'
import { shortNumber } from '@util/helpers'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const Raised = styled(({ id, title, className }) => {
  const { crowdloan: { percentRaised, raised, cap, uiStatus } = {} } = useCrowdloanById(id)
  const { t } = useTranslation()
  const accounts = useAccountAddresses()
  const myContributions = useCrowdloanContributions({ accounts, crowdloans: id ? [id] : undefined })
  const totalContribution = getTotalContributionForCrowdloan(id, myContributions.contributions)

  const suffix = (id || '').startsWith('0-') ? ' DOT' : ' KSM'

  return (
    <div className={`crowdloan-raised ${className}`} data-status={uiStatus?.toLowerCase()}>
      <div className="top">
        <span>{uiStatus === 'capped' ? `${t('Goal reached')} ✓` : title}</span>
        <span>
          {!!totalContribution && (
            <>
              <CheckCircleIcon /> {t('Contributed')}
            </>
          )}
        </span>
      </div>

      <ProgressBar percent={percentRaised} />

      <Stat
        title={
          <Pendor suffix={suffix} require={!!raised && !!cap}>
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
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: var(--font-size-small);
    margin-bottom: 0.5em;

    * {
      font-size: var(--font-size-small);
      margin: 0;

      &:first-child {
        opacity: 0.4;
      }

      &:last-child {
        display: flex;
        align-items: center;
        > svg {
          margin-right: 0.4em;
          font-size: 1.2em;
          color: var(--color-primary);
        }
      }
    }
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
