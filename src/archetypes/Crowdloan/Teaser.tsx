import { Parachain } from '@archetypes'
import { ReactComponent as CheckCircleIcon } from '@assets/icons/check-circle.svg'
import { Pill } from '@components'
import { getTotalContributionForCrowdloan, useCrowdloanContributions } from '@libs/crowdloans'
import { useAccountAddresses, useCrowdloanById, useParachainDetailsById } from '@libs/talisman'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import Countdown from './Countdown'
import Raised from './Raised'

const Teaser = styled(({ id, className }) => {
  const { t } = useTranslation()
  const { crowdloan } = useCrowdloanById(id)
  const parachainId = crowdloan?.parachain?.paraId
  const { parachainDetails } = useParachainDetailsById(parachainId)

  const accounts = useAccountAddresses()
  const myContributions = useCrowdloanContributions({ accounts, crowdloans: id ? [id] : undefined })
  const totalContribution = getTotalContributionForCrowdloan(id, myContributions.contributions)

  return (
    <Link to={`/crowdloans/${parachainDetails?.slug}`} className={`crowdloan-teaser ${className}`}>
      <Parachain.Asset id={parachainId} type="card" />
      <div className="content">
        <Parachain.Asset id={parachainId} type="logo" />
        {totalContribution && (
          <div className="has-contribution">
            <CheckCircleIcon /> {t('Contributed')}
          </div>
        )}
        <h1>{parachainDetails?.name}</h1>
        <Raised id={id} title={t('Raised')} />
      </div>

      <Pill className="countdown">
        <Countdown id={id} showSeconds={false} />
      </Pill>
    </Link>
  )
})`
  display: block;
  background: var(--color-controlBackground);
  overflow: hidden;
  border-radius: 2.4rem;
  position: relative;

  > .crowdloan-card {
    width: 100%;
    height: 0;
    padding-top: 58.4%;
  }

  > .content {
    position: relative;
    padding: 0 1.6rem 1rem 1.6rem;

    .crowdloan-logo {
      width: 6.4rem;
      height: 6.4rem;
      padding-top: 0;
      margin-top: -3.2rem;
      box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
    }

    .has-contribution {
      position: absolute;
      top: 4.8rem;
      right: 1.6rem;
      display: flex;
      align-items: center;
      padding: 0.6rem 1.2rem;
      border-radius: 9999999999rem;
      color: black;
      background: #f5f5f5;
      font-size: 1.4rem;
      line-height: 1.6rem;

      > svg {
        display: block;
        width: 1em;
        height: 1em;
        margin-right: 0.5em;
      }
    }

    h1 {
      margin: 0;
      font-size: var(--font-size-large);
      font-weight: 600;
      margin-top: 1.2rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  > .countdown {
    position: absolute;
    top: 1.6rem;
    right: 1.6rem;
    background: var(--color-activeBackground);
    color: var(--color-mid);
  }

  .crowdloan-raised {
    font-size: 0.9em;
    margin-top: calc(1.5rem + 1.5vw);
  }
`

export default Teaser
