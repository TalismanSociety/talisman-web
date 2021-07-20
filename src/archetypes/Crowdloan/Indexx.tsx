import styled from 'styled-components'
import { 
  Field,
  NoResults
} from '@components'
import { Crowdloan } from '@archetypes'
import { ReactComponent as Loader } from '@icons/loader.svg'

const FilterBar = styled(
  ({
    search='',
    order='',
    status=null,
    setSearch=()=>{}, 
    setOrder=()=>{},
    setStatus=()=>{},
    orderOptions={},
    statusOptions={},
    hasFilter=false,
    reset,
    count,
    className,
    ...rest
  }) => 
    <div 
      className={`${className} filterbar`}
      {...rest}
      >
      <span 
        className="left"
        >
        <Field.Search
          value={search}
          placeholder='Search Crowdloans'
          onChange={setSearch}
        />
        <Field.RadioGroup
          value={status}
          onChange={setStatus}
          options={statusOptions}
          small
        />
      </span>
      <span 
        className="right"
        >
        <Field.Select
          onChange={setOrder}
          options={orderOptions}
        />
      </span>
    </div>
  )
  `
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 0 2.4rem;
    margin: 2.4rem 0;

    >span{
      display: flex;
      align-items: center;
      position: relative;

      &.left{ justify-content: flex-start }
      &.center{ justify-content: center }
      &.right{ justify-content: flex-end }

      &.right{
        >* + *{
          margin-left: 1em;
        }

        .field-toggle[data-on='true'] .toggle:after{
          background: rgb(${({theme}) => theme.primary});
        }
      }
    }

    .field-search{
      width: 23vw;
    }

    .field-radiogroup{
      margin-left: 2.3rem
    }

    .field-select .children{
      font-size: 0.9em;
      box-shadow: none;
      color: rgb(${({theme}) => theme.primary});
    }
  `

const Index = styled(
  ({
    withFilter,
    className
  }) => {
    const { 
      items,
      count,
      status,
      filterProps
    } = Crowdloan.useFilter()

    return <div
      className={`crowdloan-index ${className}`}
      >
      {withFilter &&
        <FilterBar
          {...filterProps}
          count={count}
        />
      }
      {/*
        need to either create another wrapper component similar
        to NoResults which deals with pending loading status etc
        or replace NoResult with something like <Requires .../>
      */}
      <NoResults
        require={status === 'READY'}
        title={<Loader/>}
        >
        <NoResults
          require={count?.filtered > 0}
          title='Vamoosh'
          subtitle='Talisman cannot summon what you wish for.'
          text='Better luck next time.'
          >
          <div 
            className="items"
            >
            {items.map(({paraId}) =>               
              <Crowdloan.Teaser 
                key={paraId} 
                id={paraId}
              />
            )}
          </div>
        </NoResults>
      </NoResults>
    </div>
  })
  `
    .items{
      display: grid;
      grid-gap: 2.4rem;
      width: 100%;
      grid-template-columns: repeat(4, 1fr);
      padding: 0 2.4rem;
      margin: 2.4rem 0;

      .crowdloan-teaser{
        height: 25vw;
      }

      @media only screen and (max-width: 1180px) {
        grid-template-columns: repeat(3, 1fr);
        .crowdloan-teaser{
          height: 33vw;
        }
      }

      @media only screen and (max-width: 880px) {
        grid-template-columns: repeat(2, 1fr);
        .crowdloan-teaser{
          height: 47vw;
        }
      }

      @media only screen and (max-width: 630px) {
        grid-template-columns: repeat(1, 1fr);
        .crowdloan-teaser{
          height: 80vw;
        }
      }
      
    }
  `

export default Index