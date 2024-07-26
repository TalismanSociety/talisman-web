import { selectedBalancesState, selectedCurrencyState } from '../../../../domains/balances'
import { ChainProvider } from '../../../../domains/chains'
import { slpxPairsState, type SlpxPair } from '../../../../domains/staking/slpx'
import StakeProvider from '../../../recipes/StakeProvider'
import AnimatedFiatNumber from '../../AnimatedFiatNumber'
import ErrorBoundary from '../../ErrorBoundary'
import RedactableBalance from '../../RedactableBalance'
import ErrorBoundaryFallback from '../ErrorBoundaryFallback'
import Apr from './Apr'
import UnlockDuration from './UnlockDuration'
import { Decimal } from '@talismn/math'
import { useSuspenseQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue, waitForAll } from 'recoil'
import { useConfig } from 'wagmi'
import { getTokenQueryOptions } from 'wagmi/query'

const useAvailableBalance = (slpxPair: SlpxPair) => {
  const [balances, currency] = useRecoilValue(waitForAll([selectedBalancesState, selectedCurrencyState]))
  const nativeBalance = balances.find(x => x.token?.symbol.toLowerCase() === slpxPair.nativeToken.symbol.toLowerCase())

  return useMemo(
    () => ({
      amount: Decimal.fromPlanck(nativeBalance.sum.planck.transferable ?? 0n, nativeBalance.each.at(0)?.decimals ?? 0, {
        currency: slpxPair.nativeToken.symbol,
      }).toLocaleString(),
      fiatAmount: nativeBalance.sum.fiat(currency).total,
    }),
    [currency, nativeBalance.each, nativeBalance.sum, slpxPair.nativeToken.symbol]
  )
}

const AvailableBalance = (props: { slpxPair: SlpxPair }) => (
  <RedactableBalance>{useAvailableBalance(props.slpxPair).amount}</RedactableBalance>
)

const AvailableFiatBalance = (props: { slpxPair: SlpxPair }) => (
  <AnimatedFiatNumber end={useAvailableBalance(props.slpxPair).fiatAmount} />
)

const StakePercentage = (props: { slpxPair: SlpxPair }) => {
  const balances = useRecoilValue(selectedBalancesState)

  const config = useConfig()
  const liquidToken = useSuspenseQuery(
    getTokenQueryOptions(config, {
      chainId: props.slpxPair.chain.id,
      address: props.slpxPair.vToken.address,
    })
  )

  const nativeBalance = useMemo(
    () => balances.find(x => x.token?.symbol.toLowerCase() === props.slpxPair.nativeToken.symbol.toLowerCase()),
    [balances, props.slpxPair.nativeToken.symbol]
  )
  const liquidBalance = useMemo(
    () => balances.find(x => x.token?.symbol.toLowerCase() === liquidToken.data?.symbol?.toLowerCase()),
    [balances, liquidToken.data?.symbol]
  )

  return (
    <StakeProvider.StakePercentage
      percentage={useMemo(
        () =>
          liquidBalance.sum.planck.total === 0n
            ? 0
            : new BigNumber(liquidBalance.sum.planck.total.toString())
                .div((nativeBalance.sum.planck.total + liquidBalance.sum.planck.total).toString())
                .toNumber(),
        [liquidBalance.sum.planck.total, nativeBalance.sum.planck.total]
      )}
    />
  )
}

const StakeProviders = () => {
  const slpxPairs = useRecoilValue(slpxPairsState)

  return (
    <>
      {slpxPairs.map((slpxPair, index) => {
        const { symbol, logo } = slpxPair.nativeToken
        const provider = 'Bifrost SLPx'
        return (
          <ChainProvider
            key={index}
            chain={{
              genesisHash: slpxPair.substrateChainGenesisHash,
            }}
          >
            <ErrorBoundary
              orientation="horizontal"
              renderFallback={() => <ErrorBoundaryFallback logo={logo} symbol={symbol} provider={provider} />}
            >
              <StakeProvider
                symbol={symbol}
                logo={logo}
                chain={slpxPair.chain.name}
                apr={<Apr slpxPair={slpxPair} />}
                type="Liquid staking"
                provider={provider}
                unbondingPeriod={<UnlockDuration slpxPair={slpxPair} />}
                availableBalance={<AvailableBalance slpxPair={slpxPair} />}
                availableFiatBalance={<AvailableFiatBalance slpxPair={slpxPair} />}
                stakePercentage={<StakePercentage slpxPair={slpxPair} />}
                stakeButton={
                  <StakeProvider.StakeButton
                    as={Link}
                    to={`?action=stake&type=slpx&contract-address=${slpxPair.splx}`}
                  />
                }
              />
            </ErrorBoundary>
          </ChainProvider>
        )
      })}
    </>
  )
}

export default StakeProviders
