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
        <Field.Search
          className="searchbar"
          value={search}
          placeholder={t('Search Crowdloans')}
          onChange={(search: any) => {
            setSearch(search)
            trackGoal('9XUF7WEB', 1) // crowdloan_search
          }}
        />
        <div className="filters">
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
          <Field.RadioGroup
            value={network}
            onChange={(network: any) => {
              setNetwork(network)
              trackGoal('0AO7IT2G', 1) // crowdloan_filter
            }}
            options={networkOptions}
            small
            primary
          />
        </div>
      </div>
    )
  }
)`
  margin: 2.4rem 0;
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;

  .searchbar {
    display: inline-block;
    width: 100%;
    @media ${device.lg} {
      width: auto;
    }
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: space-between;
    width: 100%;
  }
`

const Index = styled(({ withFilter, className }) => {
  const { t } = useTranslation()
  const { crowdloans, count, loading, filterProps } = Crowdloan.useFilter()

  return (
    <div className={`crowdloan-index ${className}`}>
      {/* TODO: Remove for now as no Learn more link yet. */}
      {/* <UnlockTalismanBanner /> */}
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

  .await {
    font-size: var(--font-size-xxlarge);
  }
`

export default Index
