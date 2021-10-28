import { ChainLogo, Info, Panel, PanelSection, Pendor } from '@components'
import {
  getTotalContributionForCrowdloan,
  groupTotalContributionsByCrowdloan,
  useCrowdloanContributions,
} from '@libs/crowdloans'
import { calculateCrowdloanPortfolioAmounts, usePortfolio, useTaggedAmountsInPortfolio } from '@libs/portfolio'
import { useAccountAddresses, useCrowdloanById, useCrowdloans } from '@libs/talisman'
import { useTokenPrice } from '@libs/tokenprices'
import { useChain } from '@talismn/api-react-hooks'
import { addBigNumbers, encodeAnyAddress, multiplyBigNumbers, planckToTokens, useFuncMemo } from '@talismn/util'
import { formatCommas, formatCurrency } from '@util/helpers'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const CrowdloanItem = styled(({ id, className }) => {
  const { crowdloan } = useCrowdloanById(id)
  const parachainId = crowdloan?.parachain.paraId
  const relayChainId = 2 // kusama
  const relayChain = useChain(relayChainId)
  const chain = useChain(parachainId)

  const { nativeToken: relayNativeToken, tokenDecimals: relayTokenDecimals } = relayChain
  const { name, longName } = chain
  const { price: relayTokenPrice, loading: relayPriceLoading } = useTokenPrice(relayNativeToken)

  const accounts = useAccountAddresses()
  const encoded = useMemo(() => accounts?.map(account => encodeAnyAddress(account, 2)), [accounts])
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
    <div className={className}>
      <span className="left">
        <Info title={name} subtitle={longName || name} graphic={<ChainLogo chain={chain} type="logo" size={4} />} />
      </span>
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

const Crowdloans = ({ className }: { className?: string }) => {
  const { t } = useTranslation()
  const accounts = useAccountAddresses()
  const encoded = useMemo(() => accounts?.map(account => encodeAnyAddress(account, 2)), [accounts])
  const { contributions, skipped, loading, error } = useCrowdloanContributions({ accounts: encoded })
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
        {skipped || loading ? (
          <PanelSection comingSoon>
            <div>{t('Summoning Crowdloan Contributions...')}</div>
            <Pendor />
          </PanelSection>
        ) : error ? (
          <PanelSection comingSoon>{String(error)}</PanelSection>
        ) : Object.keys(totalAliveContributions).length < 1 ? (
          <PanelSection comingSoon>{`${`😕 `} ${t('You have not contributed to any Crowdloans')}`}</PanelSection>
        ) : (
          Object.keys(totalAliveContributions).map(id => (
            <PanelSection key={id}>
              <CrowdloanItem id={id} />
            </PanelSection>
          ))
        )}
      </Panel>
    </section>
  )
}

export default Crowdloans
