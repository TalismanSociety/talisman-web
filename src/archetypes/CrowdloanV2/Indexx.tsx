import { Crowdloan } from '@archetypes'
import { Await, Field, Grid, NoResults } from '@components'
import { trackGoal } from '@libs/fathom'
import { device } from '@util/breakpoints'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const FilterBar = styled(
  ({
    search = '',
    order = '',
    status = null,
    network = null,
    setSearch = () => {},
    setOrder = () => {},
    setStatus = () => {},
    setNetwork = () => {},
    orderOptions = {},
    statusOptions = {},
    networkOptions = {},
    hasFilter = false,
    reset,
    count,
    className,
    ...rest
  }) => {
    const { t } = useTranslation()
    return (
      <div className={`${className} filterbar`} {...rest}>
        <div className="filters">
          <Field.RadioGroup
            value={network}
            className="network-filter"
            onChange={(network: any) => {
              setNetwork(network)
              trackGoal('0AO7IT2G', 1) // crowdloan_filter
            }}
            options={networkOptions}
            small
            primary
          />
          <Field.Search
            className="searchbar"
            value={search}
            placeholder={t('Search Crowdloans')}
            onChange={(search: any) => {
              setSearch(search)
              trackGoal('9XUF7WEB', 1) // crowdloan_search
            }}
          />
        </div>
        <Field.RadioGroup
          value={status}
          onChange={(status: any) => {
            setStatus(status)
            trackGoal('0AO7IT2G', 1) // crowdloan_filter
          }}
          options={statusOptions}
          small
          secondary
        />
      </div>
    )
  }
)`
  margin: 2.4rem 0;
  display: flex;
  align-items: center;
  gap: 2rem;
  justify-content: space-between;
  flex-wrap: wrap;

  .network-filter {
    align-items: unset;
    flex-direction: unset;

    .children {
      border-radius: 1rem;
    }

    .children .pill {
      border-radius: inherit;
    }
  }

  .searchbar {
    display: inline-block;
    width: 100%;
    @media ${device.lg} {
      width: auto;
    }
  }

  .filters {
    display: flex;
    flex-wrap: wrap-reverse;
    gap: 2rem;
    // justify-content: space-between;
    // width: 100%;
  }
`

// const PopularCrowdloans = styled(({ className }) => {
//   const { crowdloans } = Crowdloan.useFilter()
//   return (
//     <Panel className={className}>
//       <PanelSection className="card">
//         <div className="title">Popular Crowdloans</div>
//         <ol className="list">
//           {crowdloans.slice(0, 5).map(({ id }) => (
//             <li key={id}>
//               <CrowdloanSummary id={id} />
//             </li>
//           ))}
//         </ol>
//       </PanelSection>
//     </Panel>
//   )
// })`
//   min-width: max-content;

//   .card {
//     padding: 2.4rem;
//   }

//   .title {
//     color: var(--color-dim);
//   }

//   .list {
//     margin-top: 2rem;

//     & > * + * {
//       margin-top: 1rem;
//     }
//   }

//   ol {
//     list-style: none;
//     counter-reset: popular-crowdloans-counter;
//     padding-inline: 0;
//     margin-block-end: 0;
//   }
//   ol li {
//     counter-increment: popular-crowdloans-counter;
//     display: flex;
//     align-items: center;
//     gap: 1rem;
//   }
//   ol li::before {
//     content: counter(popular-crowdloans-counter);
//     color: var(--color-primary);
//     font-weight: bold;
//     max-width: 1rem;
//     padding-right: 1rem;
//   }
// `

// const LearnCrowdloansBanner = () => {
//   return (
//     <Panel>
//       <PanelSection>LearnCrowdloansBanner</PanelSection>
//     </Panel>
//   )
// }

const Index = styled(({ withFilter, className }) => {
  const { t } = useTranslation()
  const { crowdloans, count, loading, filterProps } = Crowdloan.useFilter()

  return (
    <div className={`crowdloan-index ${className}`}>
      <div className="overview">
        {/* TODO: Comment out for now */}
        {/* <PopularCrowdloans /> */}
        {/* <LearnCrowdloansBanner />*/}
        {/* <UnlockTalismanBanner /> */}
      </div>
      {withFilter && <FilterBar {...filterProps} count={count} />}
      <Await until={!loading}>
        <NoResults
          require={count?.filtered > 0}
          title={t('noResult.title')}
          subtitle={t('noResult.subtitle')}
          text={t('noResult.text')}
        >
          <Grid>
            {crowdloans.map(({ id }) => (
              <Crowdloan.Teaser key={id} id={id} />
            ))}
          </Grid>
        </NoResults>
      </Await>
    </div>
  )
})`
  padding: 2.4rem;

  .overview {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .await {
    font-size: var(--font-size-xxlarge);
  }
`

export default Index
