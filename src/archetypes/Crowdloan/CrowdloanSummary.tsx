import { Parachain } from '@archetypes'
import { ReactComponent as AllAccountsIcon } from '@assets/icons/all-accounts.svg'
import { useCrowdloanById, useParachainDetailsById } from '@libs/talisman'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const CrowdloanSummary = styled(({ id, className = '' }) => {
  const { crowdloan } = useCrowdloanById(id)
  const parachainId = crowdloan?.parachain?.paraId
  const contributors = crowdloan?.contributions?.totalCount
  const { parachainDetails } = useParachainDetailsById(parachainId)

  return (
    <Link to={`/crowdloans/${parachainDetails?.slug}`} className={`crowdloan-teaser ${className}`}>
      <div className={className}>
        <Parachain.Asset className="logo" id={parachainId} type="logo" />
        <div>
          <div className="name">{parachainDetails?.name}</div>
          <div className="contributors">
            <AllAccountsIcon className="contributor-icon" />
            {contributors}
          </div>
        </div>
      </div>
    </Link>
  )
})`
  display: flex;
  align-items: center;
  gap: 2rem;

  .logo {
    max-width: 4rem;
    max-height: 4rem;
  }

  .contributors {
    display: flex;
    align-items: center;
    margin-left: -1rem;
  }

  .contributor-icon {
    font-size: 2em;
  }

  .name {
    color: var(--color-text);
    font-size: var(--font-size-large);
    font-weight: bold;
  }
`
