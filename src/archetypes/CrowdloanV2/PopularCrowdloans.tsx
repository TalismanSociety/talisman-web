import { Crowdloan } from '@archetypes'
import { Panel, PanelSection } from '@components'
import styled from 'styled-components'

import { CrowdloanSummary } from './CrowdloanSummary'

export const PopularCrowdloans = styled(({ className }) => {
  const { crowdloans } = Crowdloan.useFilter()
  return (
    <Panel className={className}>
      <PanelSection className="card">
        <div className="title">Popular Crowdloans</div>
        <ol className="list">
          {crowdloans.slice(0, 5).map(({ id }) => (
            <li key={id}>
              <CrowdloanSummary id={id} />
            </li>
          ))}
        </ol>
      </PanelSection>
    </Panel>
  )
})`
  min-width: max-content;

  .card {
    padding: 2.4rem;
  }

  .title {
    color: var(--color-dim);
  }

  .list {
    margin-top: 2rem;

    & > * + * {
      margin-top: 1rem;
    }
  }

  ol {
    list-style: none;
    counter-reset: popular-crowdloans-counter;
    padding-inline: 0;
    margin-block-end: 0;
  }
  ol li {
    counter-increment: popular-crowdloans-counter;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  ol li::before {
    content: counter(popular-crowdloans-counter);
    color: var(--color-primary);
    font-weight: bold;
    max-width: 1rem;
    padding-right: 1rem;
  }
`
