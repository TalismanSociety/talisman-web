import { Parachain } from '@archetypes'
import { Pill } from '@components'
import styled from '@emotion/styled'
import { useCrowdloanById, useParachainDetailsById } from '@libs/talisman'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import Bonus from './Bonus'
import Countdown from './Countdown'
import Raised from './Raised'

const Teaser = styled(({ id, contributed, className }: { id: string; contributed?: boolean; className?: string }) => {
  const { t } = useTranslation()
  const { crowdloan } = useCrowdloanById(id)
  const parachainId = crowdloan?.parachain?.paraId
  const { parachainDetails } = useParachainDetailsById(parachainId)

  return (
    <Link to={`/crowdloans/${parachainDetails?.slug ?? ''}`} className={`crowdloan-teaser ${className ?? ''}`}>
      <Parachain.Asset id={parachainId ?? ''} type="card" />
      <div className="content">
        <div className="header">
          <Parachain.Asset id={parachainId ?? ''} type="logo" />
          <Bonus short id={id} prefix={<Parachain.Asset id={parachainId ?? ''} type="logo" />} />
        </div>
        <h1>{parachainDetails?.name}</h1>
        <Raised id={id} title={t('Raised')} contributed={contributed} />
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

    > .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: -3rem;

      > .crowdloan-logo {
        width: 6.4rem;
        height: 6.4rem;
        padding-top: 0;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
      }

      .crowdloan-bonus {
        display: flex;
        align-items: center;
        border-radius: 2em;
        padding: 0.3em 0.8em;
        font-size: 1.4rem;
        background: var(--color-dark);

        .crowdloan-logo {
          font-size: 1.4rem;
          margin-right: 0.5em;
        }
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
