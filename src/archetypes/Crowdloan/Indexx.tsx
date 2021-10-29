import { Crowdloan } from '@archetypes'
import { Await, Field, Grid, NoResults } from '@components'
import { device } from '@util/breakpoints'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const FilterBar = styled(
  ({
    search = '',
    order = '',
    status = null,
    setSearch = () => {},
    setOrder = () => {},
    setStatus = () => {},
    orderOptions = {},
    statusOptions = {},
    hasFilter = false,
    reset,
    count,
    className,
    ...rest
  }) => {
    const { t } = useTranslation()
    return (
      <div className={`${className} filterbar`} {...rest}>
        <Field.Search className="searchbar" value={search} placeholder={t('Search Crowdloans')} onChange={setSearch} />
        <Field.RadioGroup value={status} onChange={setStatus} options={statusOptions} small />
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
`

const Index = styled(({ withFilter, className }) => {
  const { t } = useTranslation()
  const { crowdloans, count, loading, filterProps } = Crowdloan.useFilter()

  return (
    <div className={`crowdloan-index ${className}`}>
      {/* TODO: Remove for now as no Learn more link yet */}
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
