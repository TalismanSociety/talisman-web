import styled from 'styled-components'
import { useParams } from "react-router-dom";
import { 
  Button, 
  Pill, 
  Panel, 
  Poster, 
  Stat 
} from '@components'
import { useCrowdloanBySlug, useCrowdloanAssets } from '@libs/talisman'
import { Crowdloan } from '@archetypes'
import { formatCommas } from '@util/helpers'

const CrowdloanDetail = styled(
  ({
    className
  }) => {
    const { slug } = useParams()
    const {
      id,
      name,
      subtitle, 
      info,
      token
    } = useCrowdloanBySlug(slug)
    const { banner } = useCrowdloanAssets(id)

    return <section
      className={className}
      >
      <Poster
        backgroundImage={banner}
      />
      <div 
        className="content"
        >
        <article>
          <Crowdloan.Asset
            id={id}
            type='logo'
          />
          <header>
            <h1>{name}</h1>
            <h2>{subtitle}</h2>
          </header>
          <div 
            className="tags"
            >
            <Pill>👱 240 Participants</Pill>
            <Crowdloan.Tags
              id={id}
            />
          </div>
          <p 
            className='info'
            >
            {info}
          </p>
          <Crowdloan.Links
            id={id}
          />
        </article>
        <aside>
          <Panel>
            <Panel.Section
              title='Raised'
              >
              <Crowdloan.Raised id={id}/>
            </Panel.Section>
            <Panel.Section
              title='Ends in'
              >
              <Crowdloan.Countdown
                id={id}
              />
            </Panel.Section>
            <Panel.Section>
              <Button 
                primary
                >
                Contribute
              </Button>
            </Panel.Section>
          </Panel>

          <Panel
            title='Rewards'
            >
            <Stat title='Token Name'>{token?.symbol}</Stat>
            <Stat title='Total Supply'>{formatCommas(token?.supply)}</Stat>
            <Stat title='Crowdloan Allocation'>{formatCommas(token?.allocation)}</Stat>
            <Stat title='Vesting Schedule'>{token?.vesting} Months</Stat>
            <Stat title='Token Price'>${token?.price} USD</Stat>
          </Panel>

          <Panel
            title='Contributors'
            >
            [todo: pulling from?]
          </Panel>
        </aside>
      </div>
    </section>
  })
  `
    >.poster{
      height: 26.4rem;
      min-height: 10rem
    }

    >.content{
      width: calc(115.4rem + 10vw);
      margin: 0 auto;
      padding: 0 5vw;
      display: flex;
      justify-content: space-between;
      z-index: 1;
      position: relative;

      >article{
        margin-top: -4rem;
        padding-right: 4vw;
        width: 61%;
        
        .crowdloan-logo{
          width: 8rem;
          height: 8rem;
        }

        header{
          h1{
            margin-top: 0.7rem
          }
          
          h2{
            font-size: var(--font-size-xlarge);
            opacity: 0.5;
          }
        }

        .tags{
          display: block;
          >*{
            display: inline-block;
            margin-right: 0.5rem
          }
        }

        .info{
          margin: 3rem 0 4rem;
        }
      }

      >aside{
        margin-top: 6.3rem;
        width: 39%;

        .stat{
          .value{
            color: rgb(${({ theme }) => theme.primary});
          }

          & + .stat {
            margin-top: 0.425em;
          }
        }

        .panel + .panel{
          margin-top: 1.4em;
        }

        .button{
          display: block;
          width: 100%;
        }
      }
    }
  `

export default CrowdloanDetail