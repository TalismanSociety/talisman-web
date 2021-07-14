import styled from 'styled-components'
import { 
  useCrowdloanAggregateStats 
} from '@libs/talisman'
import { 
  Poster, 
  Pill, 
  Pendor,
  Field,
  NoResults
} from '@components'
import { Crowdloan } from '@archetypes'
import { shortNumber } from '@util/helpers'
import billboardImage from '@assets/parachain_index_billboard_text.png'
import { ReactComponent as IconClear } from '@assets/icons/x-circle.svg'

const Billboard = styled(
  ({
    className,
    ...rest
  }) => {
    const { 
      raised,
      projects,
      status
    } = useCrowdloanAggregateStats()

    return <Poster
      className={`${className} billboard`}
      {...rest}
      title="Unlock the Talisman"
      backgroundImage={billboardImage}
      >
      <Pill large>
        💰&nbsp;
        <Pendor
          require={status === 'READY'}
          >
          {shortNumber(raised)}
        </Pendor>
        &nbsp;Raised
      </Pill>
      <Pill large>
        👍&nbsp;
        <Pendor
          require={!!projects}
          >
          {shortNumber(projects)}
        </Pendor>
        &nbsp;Projects
      </Pill>
      {/*<Pill large>
        😍&nbsp;
        <Pendor
          require={status === 'READY'}
          >
          {shortNumber(contributors)}
        </Pendor>
        &nbsp;Contributors
      </Pill>*/}
    </Poster>
  })
  `
    background: rgb(${({theme}) => theme.foreground});
    background-size: 60%;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    color: var(--color-light);

    .content{
      h1,h2{
        display: none;
      }
    }
    .pill{
      margin: 0 0.5em;
    }
  `

const FilterBar = styled(
  ({
    tags=[],
    search='',
    order='',
    showComplete=false,
    setTags=()=>{}, 
    setSearch=()=>{}, 
    setOrder=()=>{},
    setShowComplete=()=>{},
    orderOptions={},
    tagOptions={},
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
        {/*<Filter
          value={tags}
          options={tagOptions}
          onChange={val => setTags(val)}
        />*/}
        <span
          className="reset"
          data-display={hasFilter}
          onClick={() => reset()}
          >
          <IconClear/>
        </span>
      </span>
      <span 
        className="center"
        >
        <span
          className="total"
          >
         Showing {count?.filtered} <span className="muted">of {count?.total}</span>
        </span>
      </span>
      <span 
        className="right"
        >
        <Field.Toggle
          label={'Show\nCompleted'}
          value={showComplete}
          onChange={setShowComplete}
          inline
        />
        <Field.Select
          onChange={setOrder}
          options={
            Object
              .keys(orderOptions)
              .map(key => ({key: key, value: orderOptions[key]}))
          }
        />
      </span>
    </div>
  )
  `
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 0 4rem;
    margin: 2.4rem 0;

    >span{
      display: flex;
      align-items: center;
      position: relative;

      &.left{ justify-content: flex-start }
      &.center{ justify-content: center }
      &.right{ justify-content: flex-end }

      &.right,
      &.left{
        width: 40%;
      }

      &.right{
        >* + *{
          margin-left: 1em;
        }

        .field-toggle[data-on='true'] .toggle:after{
          background: rgb(${({theme}) => theme.primary});
        }
      }
    }

    .field-search input{
      width: 23vw;  
    }


    .field-select .children{
      font-size: 0.9em;
      box-shadow: none;
      color: rgb(${({theme}) => theme.primary});
    }

    .reset{
      position: absolute;
      top: 50%;
      right: -1em;
      opacity: 0;
      transition: all 0.2s;
      cursor: pointer;
      pointer-events: none;
      transform: translateY(-50%);
      z-index: 0;
      margin-left: 0.5em;
      width: 1em;
      height: 1em;

      &:hover{
        opacity: 0.6;
      }

      &[data-display="true"]{
        opacity: 0.4;
        pointer-events: all;
        right: -1.5em;
      }
    }
  `

const CrowdloanIndex = styled(
  ({
    className
  }) => {
    const { 
      items,
      count,
      filterProps
    } = Crowdloan.useFilter()

    return <div
      className={className}
      >
      <Billboard/>
      <FilterBar
        {...filterProps}
        count={count}
      />
     
        <NoResults
          require={count?.filtered > 0}
          >
          <div 
            className="items"
            >
            {items.map(({id}) =>               
              <Crowdloan.Teaser 
                key={id} 
                id={id}
              />
            )}
          </div>
        </NoResults>
      
    </div>
  })
  `

    .items{
      display: grid;
      grid-gap: 2.4rem;
      width: 100%;
      grid-template-columns: repeat(4, 1fr);
      padding: 0 2.4rem 2.4rem 2.4rem;

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

export default CrowdloanIndex