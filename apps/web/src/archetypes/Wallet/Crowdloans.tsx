import { ChainLogo, ExtensionStatusGate, Info, Panel, PanelSection, Pendor } from '@components'
import { selectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { tokenPriceState } from '@domains/chains/recoils'
import { useTotalCrowdloanTotalFiatAmount } from '@domains/crowdloans/hooks'
import styled from '@emotion/styled'
import { CrowdloanContribution, useCrowdloanContributions } from '@libs/crowdloans'
import { Moonbeam } from '@libs/crowdloans/crowdloanOverrides'
import { MoonbeamPortfolioTag } from '@libs/moonbeam-contributors'
import { calculateCrowdloanPortfolioAmounts, useTaggedAmountsInPortfolio } from '@libs/portfolio'
import { useCrowdloanById, useParachainAssets, useParachainDetailsById } from '@libs/talisman'
import { SupportedRelaychains, parachainDetails } from '@libs/talisman/util/_config'
import { planckToTokens } from '@talismn/util'
import { formatCommas, formatCurrency } from '@util/helpers'
import { Maybe } from '@util/monads'
import BigNumber from 'bignumber.js'
import { Suspense, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

const CrowdloanItem = styled(
  ({ contribution, className }: { contribution: CrowdloanContribution; className?: string }) => {
    const { t } = useTranslation()

    const id = contribution.parachain.paraId

    const asset = useParachainAssets(id)

    const relayChainId = contribution.parachain.paraId.split('-')[0]
    const relayChain = Maybe.of(relayChainId).mapOrUndefined(x => SupportedRelaychains[x]!)
    const chain = parachainDetails.find(x => x.id === id)

    const { tokenSymbol: relayNativeToken, coingeckoId, tokenDecimals: relayTokenDecimals } = relayChain ?? {}
    const { name } = chain ?? {}

    const priceLoadable = useRecoilValueLoadable(tokenPriceState({ coingeckoId: coingeckoId!, fiat: 'usd' }))

    const relayTokenPrice = priceLoadable.valueMaybe()?.toString()
    const relayPriceLoading = priceLoadable.state === 'loading'

    const relayTokenSymbol = relayNativeToken ?? 'Planck'
    const contributedTokens = planckToTokens(contribution.amount, relayTokenDecimals!)
    const contributedUsd = new BigNumber(contributedTokens).times(relayTokenPrice ?? 0).toString()

    const portfolioAmounts = useMemo(
      () => calculateCrowdloanPortfolioAmounts([contribution], relayTokenDecimals, relayTokenPrice),
      [contribution, relayTokenDecimals, relayTokenPrice]
    )

    useTaggedAmountsInPortfolio(portfolioAmounts)

    return (
      <div className={`${className} ${id}`}>
        <span className="left">
          <Info title={name} subtitle={name} graphic={<ChainLogo chain={{ ...chain, asset }} type="logo" size={4} />} />
          <Suspense fallback={null}>
            {Moonbeam.is(Number(id.split('-')[0]), Number(id.split('-')[1])) ? <MoonbeamPortfolioTag /> : null}
          </Suspense>
        </span>
        <span className="right">
          <Info
            title={
              <Pendor suffix={` ${relayTokenSymbol} ${t('Contributed')}`}>
                {contributedTokens && formatCommas(contributedTokens)}
              </Pendor>
            }
            subtitle={
              contributedTokens ? (
                <Pendor prefix={!contributedUsd && '-'} require={!relayPriceLoading}>
                  {contributedUsd && formatCurrency(contributedUsd)}
                </Pendor>
              ) : null
            }
          />
        </span>
      </div>
    )
  }
)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  > span {
    display: flex;
    align-items: center;

    &.right {
      text-align: right;
    }
  }
`

const CrowdloanItemWithLink = styled((props: { contribution: CrowdloanContribution; className?: string }) => {
  const { className } = props
  const { crowdloan } = useCrowdloanById(props.contribution.id)
  const parachainId = crowdloan?.parachain?.paraId
  const { parachainDetails } = useParachainDetailsById(parachainId)
  const linkToCrowdloan = parachainDetails?.slug ? `/crowdloans/${parachainDetails?.slug}` : `/crowdloans`
  return (
    <Link to={linkToCrowdloan} className={className}>
      <PanelSection>
        <CrowdloanItem contribution={props.contribution} />
      </PanelSection>
    </Link>
  )
})`
  .panel-section {
    overflow: hidden;
  }
  :first-of-type .panel-section {
    border-radius: 1.6rem 1.6rem 0 0;
  }

  :last-of-type .panel-section {
    border-radius: 0 0 1.6rem 1.6rem;
  }

  :only-of-type .panel-section {
    border-radius: 1.6rem;
  }

  .panel-section:hover {
    background-color: rgb(38, 38, 38);
  }

  :not(:last-of-type) .panel-section {
    border-bottom: 1px solid #2a2a2a;
  }
`

const ExtensionUnavailable = styled((props: any) => {
  const { t } = useTranslation()
  return (
    <PanelSection comingSoon {...props}>
      <p>{t('extensionUnavailable.subtitle')}</p>
      <p>{t('extensionUnavailable.text')}</p>
    </PanelSection>
  )
})`
  text-align: center;

  > *:not(:last-child) {
    margin-bottom: 2rem;
  }
  > *:last-child {
    margin-bottom: 0;
  }

  > h2 {
    color: var(--color-text);
    font-weight: 600;
    font-size: 1.8rem;
  }
  p {
    color: #999;
    font-size: 1.6rem;
  }
`

const Crowdloans = ({ className }: { className?: string }) => {
  const { t } = useTranslation()
  const accounts = useRecoilValue(selectedSubstrateAccountsState)
  const { contributions, hydrated: contributionsHydrated } = useCrowdloanContributions({
    accounts: useMemo(() => accounts.map(x => x.address), [accounts]),
  })
  const crowdloansUsd = useTotalCrowdloanTotalFiatAmount()

  return (
    <section className={`wallet-crowdloans ${className}`} css={{ marginBottom: '2rem' }}>
      <Panel
        title={t('Crowdloans')}
        subtitle={crowdloansUsd && crowdloansUsd !== 0 ? formatCurrency(crowdloansUsd) : ''}
      >
        {!contributionsHydrated ? (
          <PanelSection comingSoon>
            <div>{t('Summoning Crowdloan Contributions...')}</div>
            <Pendor />
          </PanelSection>
        ) : contributions.length < 1 ? (
          <PanelSection comingSoon>{`${`😕 `} ${t('You have not contributed to any Crowdloans')}`}</PanelSection>
        ) : (
          <ExtensionStatusGate unavailable={<ExtensionUnavailable />}>
            {contributions.map(contribution => (
              <CrowdloanItemWithLink key={contribution.id} contribution={contribution} />
            ))}
          </ExtensionStatusGate>
        )}
      </Panel>
    </section>
  )
}

export default Crowdloans
