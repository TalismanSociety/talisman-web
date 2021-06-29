import styled from 'styled-components'
import { useParams } from "react-router-dom";
import { 
  Button, 
  Pill, 
  Panel, 
  Poster, 
  Stat 
} from '@components'
import { useCrowdloanBySlug } from '@libs/talisman'
import { Crowdloan } from '@archetypes'
import { useParachainAssetFullPath } from '@util/hooks'
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
      assets,
      token
    } = useCrowdloanBySlug(slug)
    const posterUrl = useParachainAssetFullPath(assets?.poster) 

    return <section
      className={className}
      >
      <Poster
        backgroundImage={posterUrl}
      />
      <div 
        className="content"
        >
        <article>
          <Crowdloan.Icon
            className="icon"
            id={id}
          />
          <header>
            <h1>{name}</h1>
            <h2>{subtitle}</h2>
            <div 
              className="info"
              >
              <Pill>👱 240 Participants</Pill>
              <Pill
                primary
                onClick={() => console.log('todo')}
                >
                Website
              </Pill>
              <Pill
                primary
                onClick={() => console.log('todo')}
                >
                Twitter
              </Pill>
              <Pill
                primary
                onClick={() => console.log('todo')}
                >
                Discord
              </Pill>
            </div>
            <p>{info}</p>
          </header>

          {/*<Pendor
            require={status === 'READY'}
            >
            <img src={icon} alt={``}/>
            <h1>{name}</h1>
            <h2>{subtitle}</h2>
            <p>{info}</p>
            <p>Url: <a href={url} target='_blank' rel="noreferrer">{url}</a></p>
            <hr/>
            <p>Cap: {cap}</p>
            <p>Raised: {raised}</p>
            <p>Deposit: {deposit}</p>
            <p>Period: {firstPeriod}-{lastPeriod}</p>
            <p>End Block: {end}</p>
            <p>Blocks Until End: {end - blockNumber}</p>
            <p>Average Block Time: 6s</p>
            <p>End Time: {moment().add((end - blockNumber) * 6, 'seconds').format('dddd, MMMM Do YYYY, h:mm:ss a')}</p>
            <p>Countdown: <Countdown seconds={(end - blockNumber) * 6} onCompletion={console.log} /></p>
          </Pendor>*/}
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
        header{
          h1{
            margin-top: 0.7rem
          }
          
          h2{
            font-size: var(--font-size-xlarge);
            opacity: 0.5;
          }

          .info{
            margin: 3rem 0 4rem;
            .pill{
              margin-right: 0.5em
            }
          }
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