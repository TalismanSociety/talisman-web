import styled from 'styled-components'
import { 
  useCrowdloanAggregateStats 
} from '@libs/talisman'
import { 
  Poster, 
  Pill, 
  Filter, 
  Pendor,
  NoResults
} from '@components'
import { Crowdloan } from '@archetypes'
import { shortNumber } from '@util/helpers'
import billboardImage from '@assets/parachain_index_billboard.png'
import { ReactComponent as IconClear } from '@assets/icons/x-circle.svg'

const Billboard = styled(
  ({
    className,
    ...rest
  }) => {
    const { 
      raised,
      projects,
      contributors,
      status
    } = useCrowdloanAggregateStats()

    return <Poster
      className={`${className} billboard`}
      {...rest}
      title="It's time to rebuild the system"
      subtitle='Get rewarded for contributing to projects and help fund<br/>the future of the Polkadot ecosystem'
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
      <Pill large>
        😍&nbsp;
        <Pendor
          require={status === 'READY'}
          >
          {shortNumber(contributors)}
        </Pendor>
        &nbsp;Contributors
      </Pill>
    </Poster>
  })
  `
    color: var(--color-light);
    .content{

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
    setTags=()=>{}, 
    setSearch=()=>{}, 
    setOrder=()=>{},
    orderOptions={},
    tagOptions={},
    hasFilter=false,
    reset,
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
        <input 
          type="text" 
          value={search}
          placeholder='// search'
          onChange={e => setSearch(e?.target?.value)}
        />
        <Filter
          value={tags}
          options={tagOptions}
          onChange={val => setTags(val)}
        />
        <span
          className="reset"
          data-display={hasFilter}
          onClick={() => reset()}
          >
          <IconClear/>
        </span>
        
      </span>
      <span 
        className="right"
        >
        <select
          onChange={e => setOrder(e?.target?.value)}
          >
          {Object.keys(orderOptions).map(key => 
            <option 
              key={key}
              value={key}
              >
              {orderOptions[key]}
            </option>
          )}
        </select>
      </span>
    </div>
  )
  `
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 0 4rem;
    margin: 2.7rem 0;


    >span{
      display: flex;
      align-items: center;
      position: relative;
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
      filterProps
    } = Crowdloan.useFilter()

    return <div
      className={className}
      >
      <Billboard/>
      <FilterBar
        {...filterProps}
      />
     
        <NoResults
          require={!!items.length}
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
      margin-top: 3rem;

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