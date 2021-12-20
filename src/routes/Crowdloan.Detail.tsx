import { Crowdloan, Parachain } from '@archetypes'
import { Button, Panel, PanelSection, Poster, useModal } from '@components'
import { useCrowdloanByParachainId, useParachainAssets, useParachainDetailsBySlug } from '@libs/talisman'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

const CrowdloanDetail = styled(({ className }) => {
  const { t } = useTranslation()
  const { slug }: { slug: string } = useParams()

  const { parachainDetails } = useParachainDetailsBySlug(slug)
  const { banner } = useParachainAssets(parachainDetails?.id)

  const { crowdloan: { id, uiStatus } = {} } = useCrowdloanByParachainId(parachainDetails?.id)

  const { openModal } = useModal()

  const parachainId = parachainDetails?.id

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
            <PanelSection title={t('Raised')}>
              <Crowdloan.Raised id={id} />
            </PanelSection>
            <PanelSection title={t('Ends in')}>
              <Crowdloan.Countdown id={id} />
            </PanelSection>
            <PanelSection>
              <Crowdloan.Bonus
                full
                id={id}
                parachainId={parachainId}
                prefix={<Parachain.Asset id={parachainId} type="logo" />}
              />
              <Button
                primary
                onClick={() => openModal(<Crowdloan.Contribute id={id} />)}
                disabled={uiStatus !== 'active'}
              >
                {t('Contribute')}
              </Button>
            </PanelSection>
          </Panel>

          <Panel title={t('Rewards')}>
            <Crowdloan.Rewards id={id} parachainId={parachainId} />
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
    max-width: 1280px;
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
      color: var(--color-text);

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
        color: var(--color-text);
      }

      .crowdloan-bonus {
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-normal);
        margin: 0 0 1em 0;
        display: flex;
        gap: 0.5rem;
        //color: var(--color-text);
      }

      .crowdloan-logo {
        font-size: inherit;
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
