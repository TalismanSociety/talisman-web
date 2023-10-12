/* eslint-disable @typescript-eslint/no-unused-vars */
import { Crowdloan } from '@archetypes'
import { Await, Field, Grid, NoResults } from '@components'
import styled from '@emotion/styled'
import { useCrowdloanContributions } from '@libs/crowdloans'
import { device } from '@util/breakpoints'
import { useTranslation } from 'react-i18next'
import { RootNav } from './RootNav'

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
  }: any) => {
    const { t } = useTranslation()
    return (
      <div className={`${className as string} filterbar`} {...rest}>
        <Field.Search
          className="searchbar"
          value={search}
          placeholder={t('Search Crowdloans')}
          onChange={(search: any) => {
            setSearch(search)
          }}
        />
        <div className="filters">
          <Field.RadioGroup
            value={status}
            onChange={(status: any) => {
              setStatus(status)
            }}
            options={statusOptions}
            small
            secondary
          />
          <Field.RadioGroup
            value={network}
            onChange={(network: any) => {
              setNetwork(network)
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

const Index = styled(({ withFilter, className }: { withFilter: boolean; className?: string }) => {
  const { t } = useTranslation()
  const { crowdloans, count, loading, filterProps } = Crowdloan.useFilter()
  const { contributions } = useCrowdloanContributions()

  return (
    <div className={`crowdloan-index ${className ?? ''}`}>
      <RootNav />

      {/* TODO: Remove for now as no Learn more link yet. */}
      {/* <UnlockTalismanBanner /> */}
      {withFilter && <FilterBar {...filterProps} count={count} />}
      <Await until={!loading}>
        <NoResults require={count?.filtered > 0} subtitle={t('noCrowdloans.text')} text={t('noCrowdloans.subtext')}>
          <Grid>
            {crowdloans.map(({ id }) => (
              <Crowdloan.Teaser key={id} id={id} contributed={contributions.find(x => x.id === id) !== undefined} />
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
