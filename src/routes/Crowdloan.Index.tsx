import styled from 'styled-components'
import { 
  useCrowdloanFilter, 
  useCrowdloanAggregateStats 
} from '@libs/talisman'
import { 
  Poster, 
  Pill, 
  Filter, 
  Pendor
} from '@components'
import CrowdloanTeaser from '@archetypes/Crowdloan/Teaser.tsx'
import { shortNumber } from '@util/helpers'
import billboardImage from '@assets/parachain_index_billboard.png'


const Billboard = styled(
  ({
    className,
    ...rest
  }) => {
    const { 
      raised,
      projects,
      contributors
    } = useCrowdloanAggregateStats()

    return <Poster
      className={`${className} billboard`}
      {...rest}
      title="It's time to rebuild the system"
      subtitle='Get rewarded for contributing to projects and help fund the future of the Polkadot ecosystem'
      backgroundImage={billboardImage}
      >
      <Pill large>💰 {shortNumber(raised)} Raised</Pill>
      <Pill large>👍 {shortNumber(projects)} Projects Funded</Pill>
      <Pill large>😍 {shortNumber(contributors)} Contributors</Pill>
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
          [clear]
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
    padding: 2.7rem 2.4rem;

    >span{
      display: flex;
      align-items: center;
    }

    .reset{
      opacity: 0;
      transition: all 0.2s;
      cursor: pointer;
      pointer-events: none;
      transform: translateX(-0.4em);
      z-index: 0;
      margin-left: 0.5em;
      &[data-display="true"]{
        opacity: 1;
        pointer-events: all;
        transform: translateX(0);
      }
    }
  `

const CrowdloanIndex = styled(
  ({
    className
  }) => {
    const { 
      items, 
      status,
      filterProps
    } = useCrowdloanFilter()

    return <div
      className={className}
      >
      <Billboard/>
      <Pendor
        require={status === 'READY'}
        >
        <FilterBar
          {...filterProps}
        />
        <div 
          className="items"
          >
          {items.map(({id}) =>               
            <CrowdloanTeaser 
              key={id} 
              id={id}
            />
          )}
        </div>
      </Pendor>
    </div>
  })
  `

    .items{
      display: grid;
      grid-gap: 2.4rem;
      width: 100%;
      grid-template-columns: repeat(4, 1fr);
      padding: 0 2.4rem 2.4rem 2.4rem;
    }
  `

export default CrowdloanIndex