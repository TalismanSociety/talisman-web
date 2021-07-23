import styled from 'styled-components'
import { 
  useCrowdloanAggregateStats 
} from '@libs/talisman'
import { 
  Poster, 
  Pill, 
  Pendor
} from '@components'
import { Crowdloan } from '@archetypes'
import { shortNumber } from '@util/helpers'
import billboardImage from '@assets/parachain_index_billboard_text.png'

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

    min-height: 24rem;
    height: 24vw;

    .content{
      h1,h2{
        display: none;
      }
    }
    .pill{
      margin: 0 0.5em;
    }
  `

const CrowdloanIndex =
  ({
    className
  }) => 
    <div
      className={className}
      >
      <Billboard/>
      <Crowdloan.Index withFilter/>
    </div>

export default CrowdloanIndex