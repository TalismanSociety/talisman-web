import { Crowdloan, Parachain } from '@archetypes'
import { Button, Panel, PanelSection, Poster, useModal } from '@components'
import { useCrowdloanByParachainId, useParachainAssets, useParachainDetailsBySlug } from '@libs/talisman'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

const CrowdloanDetail = styled(({ className }) => {
  const { slug }: { slug: string } = useParams()

  const { parachainDetails } = useParachainDetailsBySlug(slug)
  const { banner } = useParachainAssets(parachainDetails?.id)

  const { crowdloan: { id, uiStatus } = {} } = useCrowdloanByParachainId(parachainDetails?.id)

  const { openModal } = useModal()

  return (
    <section className={className}>
      <Poster backgroundImage={banner} />
      <div className="content">
        <article>
          <Parachain.Asset id={parachainDetails?.id} type="logo" />
          <header>
            <h1>{parachainDetails?.name}</h1>
            <h2>{parachainDetails?.subtitle}</h2>
          </header>
          <p className="info">{parachainDetails?.info}</p>
          <Parachain.Links id={parachainDetails?.id} />
        </article>
        <aside>
          <Panel>
            <PanelSection title="Raised">
              <Crowdloan.Raised id={id} />
            </PanelSection>
            <PanelSection title="Ends in">
              <Crowdloan.Countdown id={id} />
            </PanelSection>
            <PanelSection>
              <Button
                primary
                onClick={() => openModal(<Crowdloan.Contribute id={id} />)}
                disabled={uiStatus !== 'active'}
              >
                Contribute
              </Button>
            </PanelSection>
          </Panel>

          <Panel title="Rewards">
            <Crowdloan.Rewards id={id} />
          </Panel>

          {/*<Panel
            title='Contributors'
            >
            <Crowdloan.Contributors id={id}/>
          </Panel>*/}
        </aside>
      </div>
    </section>
  )
})`
  > .poster {
    height: 21vw;
    min-height: 20rem;
  }

  > .content {
    width: 100%;
    max-width: calc(115.4rem + 10vw);
    margin: 0 auto;
    padding: 0 5vw;
    display: flex;
    justify-content: space-between;
    z-index: 1;
    position: relative;

    > article {
      margin-top: -4rem;
      padding-right: 4vw;
      width: 61%;

      .crowdloan-logo {
        width: 8rem;
        height: 8rem;
      }

      header {
        h1 {
          margin-top: 1.5rem;
          font-family: 'SurtExpanded', sans-serif;
        }

        h2 {
          font-size: var(--font-size-xlarge);
          opacity: 0.5;
          line-height: 1.4em;
        }
      }

      .tags {
        display: block;
        > * {
          display: inline-block;
          margin-right: 0.5rem;
        }
      }

      .info {
        margin: 3rem 0 4rem;
        white-space: pre-line;
      }
    }

    > aside {
      margin-top: 6.3rem;
      width: 39%;

      .stat {
        .value {
          color: rgb(${({ theme }) => theme.primary});
        }

        & + .stat {
          margin-top: 0.425em;
        }
      }

      .panel > h1 {
        font-family: 'SurtExpanded', sans-serif;
      }

      .panel + .panel {
        margin-top: 1.4em;
      }

      .button {
        display: block;
        width: 100%;
      }

      .stat .title {
        font-weight: var(--font-weight-bold);
      }

      .crowdloan-raised .stat {
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-xlarge);
        font-family: 'SurtExpanded', sans-serif;
      }

      .crowdloan-countdown {
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-xlarge);
        font-family: 'SurtExpanded', sans-serif;
      }
    }

    @media only screen and (max-width: 1000px) {
      > article,
      > aside {
        width: 50%;
      }
    }

    @media only screen and (max-width: 800px) {
      display: block;
      > article,
      > aside {
        width: 100%;
      }
    }
  }
`

export default CrowdloanDetail
