import { selectedSubstrateAccountsState } from '../../../../domains/accounts'
import { ChainProvider, nominationPoolsEnabledChainsState, useChainState } from '../../../../domains/chains'
import { chainDeriveState, substrateApiState, useTokenAmountFromPlanck } from '../../../../domains/common'
import { useApr, useLocalizedUnlockDuration } from '../../../../domains/staking/substrate/nominationPools'
import StakeProvider from '../../../recipes/StakeProvider'
import AnimatedFiatNumber from '../../AnimatedFiatNumber'
import ErrorBoundary from '../../ErrorBoundary'
import RedactableBalance from '../../RedactableBalance'
import ErrorBoundaryFallback from '../ErrorBoundaryFallback'
import { Decimal } from '@talismn/math'
import { usePolkadotApiId, useQueryState } from '@talismn/react-polkadot-api'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue, waitForAll } from 'recoil'

const Apr = () => <>{useApr().toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })}</>

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

const UnlockDuration = () => <>{useLocalizedUnlockDuration()}</>

const StakePercentage = () => {
  const apiId = usePolkadotApiId()
  const accounts = useRecoilValue(selectedSubstrateAccountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])
  const balances = useRecoilValue(
    waitForAll(addresses.map(address => chainDeriveState(apiId, 'balances', 'all', [address])))
  )
  const total = useMemo(() => balances.reduce((prev, curr) => prev + curr.freeBalance.toBigInt(), 0n), [balances])
  const poolMembers = useRecoilValue(useQueryState('nominationPools', 'poolMembers.multi', addresses))
  const staked = useMemo(
    () => poolMembers.reduce((prev, curr) => prev + curr.unwrapOrDefault().points.toBigInt(), 0n),
    [poolMembers]
  )

  return (
    <StakeProvider.StakePercentage
      percentage={useMemo(
        () => (staked === 0n ? 0 : new BigNumber(staked.toString()).div((total + staked).toString()).toNumber()),
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
        symbol={chain.nativeToken?.symbol}
        logo={chain.nativeToken?.logo ?? ''}
        chain={chain.name}
        apr={<Apr />}
        type="Nomination pool"
        provider={chain.name}
        unbondingPeriod={<UnlockDuration />}
        availableBalance={<AvailableBalance />}
        availableFiatBalance={<AvailableFiatBalance />}
        stakePercentage={<StakePercentage />}
        stakeButton={
          <StakeProvider.StakeButton as={Link} to={`?action=stake&type=nomination-pools&chain=${chain.id}`} />
        }
      />
    </ErrorBoundary>
  )
}

const StakeProviders = () => {
  return (
    <>
      {useRecoilValue(nominationPoolsEnabledChainsState)?.map((chain, index) => (
        <ChainProvider key={index} chain={chain}>
          <StakeProviderItem />
        </ChainProvider>
      ))}
    </>
  )
}

export default StakeProviders
