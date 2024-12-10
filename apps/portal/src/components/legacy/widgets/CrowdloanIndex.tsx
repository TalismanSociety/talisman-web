/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import styled from '@emotion/styled'
import { SearchBar } from '@talismn/ui/molecules/SearchBar'
import { useTranslation } from 'react-i18next'

import { Await } from '@/components/legacy/Await'
import { Grid } from '@/components/legacy/Grid'
import { NoResults } from '@/components/legacy/NoResults'
import { RadioGroup } from '@/components/legacy/RadioGroup'
import { useCrowdloanContributions } from '@/libs/crowdloans'
import { TitlePortal } from '@/routes/layout'
import { device } from '@/util/breakpoints'

import { CrowdloanRootNav } from './CrowdloanRootNav'
import { CrowdloanTeaser } from './CrowdloanTeaser'
import { useCrowdloanFilter } from './useCrowdloanFilter'

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
        <SearchBar
          value={search}
          placeholder={t('Search Crowdloans')}
          onChangeText={(search: any) => {
            setSearch(search)
          }}
        />
        <div className="filters">
          <RadioGroup
            value={status}
            onChange={(status: any) => {
              setStatus(status)
            }}
            options={statusOptions}
            small
            secondary
          />
          <RadioGroup
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

/** @deprecated */
export const CrowdloanIndex = styled(({ withFilter, className }: { withFilter: boolean; className?: string }) => {
  const { t } = useTranslation()
  const { crowdloans, count, loading, filterProps } = useCrowdloanFilter()
  const { gqlContributions } = useCrowdloanContributions()

  return (
    <div className={`crowdloan-index ${className ?? ''}`}>
      <TitlePortal>Crowdloans</TitlePortal>
      <CrowdloanRootNav />

      {/* TODO: Remove for now as no Learn more link yet. */}
      {/* <UnlockTalismanBanner /> */}
      {withFilter && <FilterBar {...filterProps} count={count} />}
      <Await until={!loading}>
        <NoResults require={count?.filtered > 0} subtitle={t('noCrowdloans.text')} text={t('noCrowdloans.subtext')}>
          <Grid>
            {crowdloans.map(({ id }) => (
              <CrowdloanTeaser key={id} id={id} contributed={gqlContributions.find(x => x.id === id) !== undefined} />
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
