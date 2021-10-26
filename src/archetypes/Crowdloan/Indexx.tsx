import { Crowdloan } from '@archetypes'
import { Await, Field, Grid, NoResults } from '@components'
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
        <div className="searchbar">
          <Field.Search value={search} placeholder={t('Search Crowdloans')} onChange={setSearch} />
        </div>
        <div className="filtergroup">
          <Field.RadioGroup value={status} onChange={setStatus} options={statusOptions} small />
          <span className="sortby">
            <label>{t('Sort by')}</label>
            <Field.Select onChange={setOrder} options={orderOptions} />
          </span>
        </div>
      </div>
    )
  }
)`
  padding: 0 2.4rem;
  margin: 2.4rem 0;

  .searchbar {
    display: inline-block;
    width: auto;
  }

  .filtergroup {
    margin-top: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .sortby {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1rem 0;
  }
`

const Index = styled(({ withFilter, className }) => {
  const { crowdloans, count, loading, filterProps } = Crowdloan.useFilter()

  return (
    <div className={`crowdloan-index ${className}`}>
      {withFilter && <FilterBar {...filterProps} count={count} />}
      <Await until={!loading}>
        <NoResults
          require={count?.filtered > 0}
          title="Vamoosh"
          subtitle="Talisman cannot summon what you wish for."
          text="Better luck next time."
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
  .await {
    font-size: var(--font-size-xxlarge);
  }
`

export default Index
