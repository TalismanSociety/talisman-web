import StakeProvider from '@components/recipes/StakeProvider'
import AnimatedFiatNumber from '@components/widgets/AnimatedFiatNumber'
import ErrorBoundary from '@components/widgets/ErrorBoundary'
import RedactableBalance from '@components/widgets/RedactableBalance'
import { selectedBalancesState, selectedCurrencyState } from '@domains/balances'
import { slpxPairsState, type SlpxPair } from '@domains/staking/slpx'
import { githubChainLogoUrl } from '@talismn/chaindata-provider'
import { Decimal } from '@talismn/math'
import { PolkadotApiIdProvider } from '@talismn/react-polkadot-api'
import { CircularProgressIndicator } from '@talismn/ui'
import BigNumber from 'bignumber.js'
import { Suspense, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue, waitForAll } from 'recoil'
import { useToken } from 'wagmi'
import Apr from './Apr'
import UnlockDuration from './UnlockDuration'

const useAvailableBalance = (slpxPair: SlpxPair) => {
  const [balances, currency] = useRecoilValue(waitForAll([selectedBalancesState, selectedCurrencyState]))
  const nativeBalance = balances.find(x => x.token?.symbol.toLowerCase() === slpxPair.nativeToken.symbol.toLowerCase())

  return useMemo(
    () => ({
      amount: Decimal.fromPlanck(
        nativeBalance.sum.planck.transferable ?? 0n,
        nativeBalance.each.at(0)?.decimals ?? 0,
        slpxPair.nativeToken.symbol
      ).toHuman(),
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
  const liquidToken = useToken({
    chainId: props.slpxPair.chain.id,
    address: props.slpxPair.vToken.address,
    suspense: true,
  })
  const nativeBalance = useMemo(
    () => balances.find(x => x.token?.symbol.toLowerCase() === props.slpxPair.nativeToken.symbol.toLowerCase()),
    [balances, props.slpxPair.nativeToken.symbol]
  )
  const liquidBalance = useMemo(
    () => balances.find(x => x.token?.symbol.toLowerCase() === liquidToken.data?.symbol.toLowerCase()),
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
      {slpxPairs.map((slpxPair, index) => (
        <ErrorBoundary key={index} orientation="horizontal">
          <PolkadotApiIdProvider id={slpxPair.substrateEndpoint}>
            <StakeProvider
              symbol={slpxPair.nativeToken.symbol}
              logo={githubChainLogoUrl('moonbeam')}
              chain={slpxPair.chain.name}
              apr={
                <Suspense fallback={<CircularProgressIndicator size="1em" />}>
                  <Apr slpxPair={slpxPair} />
                </Suspense>
              }
              type="Liquid staking"
              provider="Bifrost SLPx"
              unbondingPeriod={
                <Suspense fallback={<CircularProgressIndicator size="1em" />}>
                  <UnlockDuration slpxPair={slpxPair} />
                </Suspense>
              }
              availableBalance={
                <Suspense fallback={<CircularProgressIndicator size="1em" />}>
                  <AvailableBalance slpxPair={slpxPair} />
                </Suspense>
              }
              availableFiatBalance={
                <Suspense>
                  <AvailableFiatBalance slpxPair={slpxPair} />
                </Suspense>
              }
              stakePercentage={
                <Suspense fallback={<StakeProvider.StakePercentage loading />}>
                  <StakePercentage slpxPair={slpxPair} />
                </Suspense>
              }
              stakeButton={
                <StakeProvider.StakeButton as={Link} to={`?action=stake&type=slpx&contract-address=${slpxPair.splx}`} />
              }
            />
          </PolkadotApiIdProvider>
        </ErrorBoundary>
      ))}
    </>
  )
}

export default StakeProviders
