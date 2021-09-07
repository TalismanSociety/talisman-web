import { Crowdloan } from '@archetypes'
import { Await, Field, Grid, NoResults } from '@components'
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
  }) => (
    <div className={`${className} filterbar`} {...rest}>
      <span className="left">
        <Field.Search value={search} placeholder="Search Crowdloans" onChange={setSearch} />
        <Field.RadioGroup value={status} onChange={setStatus} options={statusOptions} small />
      </span>
      <span className="right">
        <Field.Select onChange={setOrder} options={orderOptions} />
      </span>
    </div>
  )
)`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0 2.4rem;
  margin: 2.4rem 0;

  > span {
    display: flex;
    align-items: center;
    position: relative;

    &.left {
      justify-content: flex-start;
    }
    &.right {
      justify-content: flex-end;
    }

    &.right {
      > * + * {
        margin-left: 1em;
      }

      .field-toggle[data-on='true'] .toggle:after {
        background: rgb(${({ theme }) => theme.primary});
      }
    }
  }

  .field-search {
    width: 23vw;
  }

  .field-radiogroup {
    margin-left: 2.3rem;

    .pill {
      white-space: pre;
    }
  }

  .field-select .children {
    font-size: 0.9em;
    box-shadow: none;
    color: rgb(${({ theme }) => theme.primary});
  }

  @media only screen and (max-width: 700px) {
    display: inline-block;
    margin-bottom: 0;
    > span {
      display: inline;
      width: 100%;

      .field-search {
        display: block;
        width: 100%;
      }

      .field-radiogroup {
        margin: 0;
        width: 40%;
        display: inline-block;
        margin-top: 1em;
      }

      .field-select {
        display: inline-block;
        margin: 0;
        float: right;
        margin-top: 0.5em;
      }
    }
  } ;
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
