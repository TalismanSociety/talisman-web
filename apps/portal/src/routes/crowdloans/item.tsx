import styled from '@emotion/styled'
import { Button } from '@talismn/ui/atoms/Button'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { useModal } from '@/components/legacy/Modal'
import { Panel, PanelSection } from '@/components/legacy/Panel'
import { Poster } from '@/components/legacy/Poster'
import { CrowdloanBonus } from '@/components/legacy/widgets/CrowdloanBonus'
import { CrowdloanContribute } from '@/components/legacy/widgets/CrowdloanContribute'
import { CrowdloanCountdown } from '@/components/legacy/widgets/CrowdloanCountdown'
import { CrowdloanRaised } from '@/components/legacy/widgets/CrowdloanRaised'
import { CrowdloanRewards } from '@/components/legacy/widgets/CrowdloanRewards'
import { ParachainAsset } from '@/components/legacy/widgets/ParachainAsset'
import { ParachainLinks } from '@/components/legacy/widgets/ParachainLinks'
import { useCrowdloanContributions } from '@/libs/crowdloans'
import { useCrowdloanByParachainId, useParachainAssets, useParachainDetailsBySlug } from '@/libs/talisman'

export const CrowdloanDetail = styled(({ className }: { className?: string }) => {
  const { t } = useTranslation()
  const { slug } = useParams<{ slug: string }>()

  const { parachainDetails } = useParachainDetailsBySlug(slug)
  const { banner } = useParachainAssets(parachainDetails?.id)

  const { crowdloan: { id, uiStatus } = {} } = useCrowdloanByParachainId(parachainDetails?.id)
  const { gqlContributions } = useCrowdloanContributions()

  const { openModal } = useModal()

  const parachainId = parachainDetails?.id

  return (
    <section className={className}>
      <Poster
        backgroundImage={banner}
        fallbackBackgroundImage="https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/promo/generic-banner.png"
      />
      <div className="content">
        <article>
          <ParachainAsset id={parachainDetails?.id ?? ''} type="logo" />
          <header>
            <h1>{parachainDetails?.name}</h1>
            <h2>{parachainDetails?.subtitle}</h2>
          </header>
          <p className="info">{parachainDetails?.info}</p>
          <ParachainLinks id={parachainDetails?.id ?? ''} />
        </article>
        <aside>
          <Panel>
            <PanelSection title={t('Raised')}>
              <CrowdloanRaised id={id ?? ''} contributed={gqlContributions.find(x => x.id === id) !== undefined} />
            </PanelSection>
            <PanelSection title={t('Contribution Window')}>
              <CrowdloanCountdown id={id} />
            </PanelSection>
            <PanelSection>
              <CrowdloanBonus full id={id ?? ''} prefix={<ParachainAsset id={parachainId ?? ''} type="logo" />} />
              {parachainDetails?.allowContribute && (
                <Button onClick={() => openModal(<CrowdloanContribute id={id} />)} disabled={uiStatus !== 'active'}>
                  {t('Contribute')}
                </Button>
              )}
            </PanelSection>
          </Panel>

          <Panel title={t('Rewards')}>
            <CrowdloanRewards id={id} />
          </Panel>

          {/* <Panel
            title='Contributors'
            >
            <Crowdloan.Contributors id={id}/>
          </Panel> */}
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
    margin: 0 auto;

    padding: 0 5vw;
    display: flex;
    justify-content: space-between;
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
