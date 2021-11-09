import { ChainLogo, Info, Panel, PanelSection, Pendor } from '@components'
import {
  getTotalContributionForCrowdloan,
  groupTotalContributionsByCrowdloan,
  useCrowdloanContributions,
} from '@libs/crowdloans'
import { calculateCrowdloanPortfolioAmounts, usePortfolio, useTaggedAmountsInPortfolio } from '@libs/portfolio'
import { useAccountAddresses, useCrowdloanById, useCrowdloans, useParachainDetailsById } from '@libs/talisman'
import { SupportedRelaychains } from '@libs/talisman/util/_config'
import { useTokenPrice } from '@libs/tokenprices'
import { useChain } from '@talismn/api-react-hooks'
import { addBigNumbers, encodeAnyAddress, multiplyBigNumbers, planckToTokens, useFuncMemo } from '@talismn/util'
import { formatCommas, formatCurrency } from '@util/helpers'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const CrowdloanItem = styled(({ id, className, infoOnly = false }) => {
  const { crowdloan } = useCrowdloanById(id)
  const parachainId = crowdloan?.parachain.paraId
  const relayChainId = useMemo(() => id.split('-')[0], [id])
  const relayChain = useChain(relayChainId)
  const chain = useChain(parachainId)

  // Only for info
  const infoChain = useChain(id)

  const { nativeToken: relayNativeToken, tokenDecimals: relayTokenDecimals } = relayChain
  const { name, longName } = infoOnly ? infoChain : chain
  const { price: relayTokenPrice, loading: relayPriceLoading } = useTokenPrice(relayNativeToken)

  const accounts = useAccountAddresses()
  const encoded = useMemo(
    () =>
      accounts?.flatMap(account => Object.values(SupportedRelaychains).map(({ id }) => encodeAnyAddress(account, id))),
    [accounts]
  )
  const { contributions } = useCrowdloanContributions({ accounts: encoded, crowdloans: id ? [id] : undefined })
  const totalContributions = getTotalContributionForCrowdloan(id, contributions)

  const relayTokenSymbol = useFuncMemo(token => token || 'Planck', relayNativeToken)
  const contributedTokens = useFuncMemo(planckToTokens, totalContributions || undefined, relayTokenDecimals)
  const contributedUsd = multiplyBigNumbers(contributedTokens, relayTokenPrice)

  const portfolioAmounts = useFuncMemo(
    calculateCrowdloanPortfolioAmounts,
    contributions,
    relayTokenDecimals,
    relayTokenPrice
  )
  useTaggedAmountsInPortfolio(portfolioAmounts)

  return (
    <div className={`${className} ${id}`}>
      <span className="left">
        <Info
          title={name}
          subtitle={longName || name}
          graphic={<ChainLogo chain={infoOnly ? infoChain : chain} type="logo" size={4} />}
        />
      </span>
      {infoOnly}
      {!infoOnly && (
        <span className="right">
          <Info
            title={
              <Pendor suffix={` ${relayTokenSymbol} Contributed`}>
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
      )}
    </div>
  )
})`
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

const CrowdloanItemWithLink = styled(props => {
  const { id, className } = props
  const { crowdloan } = useCrowdloanById(id)
  const parachainId = crowdloan?.parachain?.paraId
  const { parachainDetails } = useParachainDetailsById(parachainId)
  const linkToCrowdloan = parachainDetails?.slug ? `/crowdloans/${parachainDetails?.slug}` : `/crowdloans`
  return (
    <Link to={linkToCrowdloan} className={className}>
      <PanelSection>
        <CrowdloanItem id={id} />
      </PanelSection>
    </Link>
  )
})`
  :first-of-type .panel-section:hover {
    border-radius: 1.6rem 1.6rem 0 0;
  }

  :last-of-type .panel-section:hover {
    border-radius: 0 0 1.6rem 1.6rem;
  }

  .panel-section:hover {
    background-color: var(--color-activeBackground);
  }
`

const Crowdloans = ({ className }: { className?: string }) => {
  const { t } = useTranslation()
  const accounts = useAccountAddresses()
  const encoded = useMemo(
    () =>
      accounts?.flatMap(account => Object.values(SupportedRelaychains).map(({ id }) => encodeAnyAddress(account, id))),
    [accounts]
  )
  const { contributions, hydrated: contributionsHydrated } = useCrowdloanContributions({ accounts: encoded })
  const totalContributions = groupTotalContributionsByCrowdloan(contributions)

  const { crowdloans, hydrated } = useCrowdloans()
  const notDisolvedCrowdloanIds = useMemo(
    () => crowdloans.filter(crowdloan => crowdloan.dissolvedBlock === null).map(crowdloan => crowdloan.id),
    [crowdloans]
  )
  const totalAliveContributions = useMemo(
    () =>
      hydrated
        ? Object.fromEntries(Object.entries(totalContributions).filter(([id]) => notDisolvedCrowdloanIds.includes(id)))
        : {},
    [hydrated, totalContributions, notDisolvedCrowdloanIds]
  )

  const { totalCrowdloansUsdByAddress } = usePortfolio()
  const genericAccounts = useMemo(() => accounts?.map(account => encodeAnyAddress(account, 42)), [accounts])
  const crowdloansUsd = useMemo(
    () =>
      Object.entries(totalCrowdloansUsdByAddress || {})
        .filter(([address]) => genericAccounts && genericAccounts.includes(address))
        .map(([, crowdloansUsd]) => crowdloansUsd)
        .reduce(addBigNumbers, undefined),
    [totalCrowdloansUsdByAddress, genericAccounts]
  )

  return (
    <section className={`wallet-crowdloans ${className}`}>
      <Panel title={t('Crowdloans')} subtitle={crowdloansUsd && formatCurrency(crowdloansUsd)}>
        {!contributionsHydrated ? (
          <PanelSection comingSoon>
            <div>{t('Summoning Crowdloan Contributions...')}</div>
            <Pendor />
          </PanelSection>
        ) : Object.keys(totalAliveContributions).length < 1 ? (
          <PanelSection comingSoon>{`${`😕 `} ${t('You have not contributed to any Crowdloans')}`}</PanelSection>
        ) : (
          <>
            {Object.keys(totalAliveContributions).map(id => (
              <CrowdloanItemWithLink key={id} id={id} />
            ))}
          </>
        )}
        {/* Remove when we integrate Acala rewards + bonuses directly into our dashboard */}
        <PanelSection>
          <CrowdloanItem
            id="0-2000"
            infoOnly={
              <a
                href="https://wiki.acala.network/acala/acala-crowdloan/faq#how-do-i-check-my-crowdloan-contribution"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'underline', color: 'var(--color-primary)' }}
              >
                {t('View contributions')}
              </a>
            }
          />
        </PanelSection>
      </Panel>
    </section>
  )
}

export default Crowdloans
