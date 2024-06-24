import { selectedSubstrateAccountsState } from '../../../../domains/accounts'
import { ChainProvider, dappStakingEnabledChainsState, useChainState } from '../../../../domains/chains'
import { chainDeriveState, substrateApiState, useTokenAmountFromPlanck } from '../../../../domains/common'
import { useApr } from '../../../../domains/staking/dappStaking'
import { Maybe } from '../../../../util/monads'
import StakeProvider from '../../../recipes/StakeProvider'
import AnimatedFiatNumber from '../../AnimatedFiatNumber'
import ErrorBoundary from '../../ErrorBoundary'
import RedactableBalance from '../../RedactableBalance'
import ErrorBoundaryFallback from '../ErrorBoundaryFallback'
import UnlockDuration from './UnlockDuration'
import { Decimal } from '@talismn/math'
import { usePolkadotApiId, useQueryState } from '@talismn/react-polkadot-api'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue, waitForAll } from 'recoil'

const Apr = () => (
  <>
    {useApr().totalApr.toLocaleString(undefined, {
      style: 'percent',
      maximumFractionDigits: 2,
    })}
  </>
)

const useAvailableBalance = () => {
  const apiId = usePolkadotApiId()
  const api = useRecoilValue(substrateApiState(apiId as any))
  const accounts = useRecoilValue(selectedSubstrateAccountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])

  const balances = useRecoilValue(
    waitForAll(addresses.map(address => chainDeriveState(apiId, 'balances', 'all', [address])))
  )
  const availableBalance = useMemo(
    () =>
      Decimal.fromPlanck(
        balances.reduce((prev, curr) => prev + curr.availableBalance.toBigInt(), 0n),
        api.registry.chainDecimals.at(0) ?? 0,
        { currency: api.registry.chainTokens.at(0) }
      ),
    [api.registry.chainDecimals, api.registry.chainTokens, balances]
  )

  return availableBalance
}

const AvailableBalance = () => <RedactableBalance>{useAvailableBalance().toLocaleString()}</RedactableBalance>

const AvailableFiatBalance = () => (
  <AnimatedFiatNumber end={useTokenAmountFromPlanck(useAvailableBalance().planck).fiatAmount} />
)

const StakePercentage = () => {
  const apiId = usePolkadotApiId()
  const accounts = useRecoilValue(selectedSubstrateAccountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])
  const balances = useRecoilValue(
    waitForAll(addresses.map(address => chainDeriveState(apiId, 'balances', 'all', [address])))
  )
  const total = useMemo(() => balances.reduce((prev, curr) => prev + curr.freeBalance.toBigInt(), 0n), [balances])
  const [activeProtocol, ledgers] = useRecoilValue(
    waitForAll([
      useQueryState('dappStaking', 'activeProtocolState', []),
      useQueryState('dappStaking', 'ledger.multi', addresses),
    ])
  )
  const staked = useMemo(
    () =>
      ledgers.reduce(
        (prev, curr) =>
          prev +
          Maybe.of(
            [curr.stakedFuture.unwrapOrDefault(), curr.staked].find(x =>
              x.period.unwrap().eq(activeProtocol.periodInfo.number.unwrap())
            )
          ).mapOr(0n, x => x.voting.toBigInt() + x.buildAndEarn.toBigInt()),
        0n
      ),
    [activeProtocol.periodInfo.number, ledgers]
  )

  return (
    <StakeProvider.StakePercentage
      percentage={useMemo(
        () => (staked === 0n ? 0 : new BigNumber(staked.toString()).div(total.toString()).toNumber()),
        [staked, total]
      )}
    />
  )
}

const StakeProviderItem = () => {
  const chain = useRecoilValue(useChainState())
  const { name = '', nativeToken: { symbol, logo } = { symbol: '', logo: '' } } = chain || {}

  return (
    <ErrorBoundary
      orientation="horizontal"
      renderFallback={() => <ErrorBoundaryFallback logo={logo} symbol={symbol} provider={name} />}
    >
      <StakeProvider
        symbol={symbol}
        logo={logo}
        chain={name}
        apr={<Apr />}
        type="DApp staking"
        provider={name}
        unbondingPeriod={<UnlockDuration />}
        availableBalance={<AvailableBalance />}
        availableFiatBalance={<AvailableFiatBalance />}
        stakePercentage={<StakePercentage />}
        stakeButton={
          <StakeProvider.StakeButton as={Link} to={`?action=stake&type=dapp-staking&chain=${chain?.id ?? ''}`} />
        }
      />
    </ErrorBoundary>
  )
}

const StakeProviders = () => {
  const chains = useRecoilValue(dappStakingEnabledChainsState)

  return (
    <>
      {chains.map((chain, index) => (
        <ChainProvider key={index} chain={chain}>
          <StakeProviderItem />
        </ChainProvider>
      ))}
    </>
  )
}

export default StakeProviders
