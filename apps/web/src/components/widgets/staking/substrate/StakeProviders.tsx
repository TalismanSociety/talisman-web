import StakeProvider from '@components/recipes/StakeProvider'
import AnimatedFiatNumber from '@components/widgets/AnimatedFiatNumber'
import RedactableBalance from '@components/widgets/RedactableBalance'
import { selectedSubstrateAccountsState } from '@domains/accounts'
import { ChainContext, ChainProvider, chainsState } from '@domains/chains'
import { chainDeriveState, substrateApiState, useTokenAmountFromPlanck } from '@domains/common'
import { useInflation, useLocalizedLockDuration } from '@domains/staking/substrate/nominationPools'
import { Decimal } from '@talismn/math'
import { usePolkadotApiId, useQueryState } from '@talismn/react-polkadot-api'
import { CircularProgressIndicator } from '@talismn/ui'
import BigNumber from 'bignumber.js'
import { Suspense, useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue, waitForAll } from 'recoil'

const Apr = () => {
  return <>{useInflation().stakedReturn.toLocaleString(undefined, { style: 'percent' })}</>
}

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
        api.registry.chainTokens.at(0)
      ),
    [api.registry.chainDecimals, api.registry.chainTokens, balances]
  )

  return availableBalance
}

const AvailableBalance = () => <RedactableBalance>{useAvailableBalance().toHuman()}</RedactableBalance>

const AvailableFiatBalance = () => (
  <AnimatedFiatNumber end={useTokenAmountFromPlanck(useAvailableBalance().planck).fiatAmount} />
)

const UnlockDuration = () => <>{useLocalizedLockDuration()}</>

const StakePercentage = () => {
  const apiId = usePolkadotApiId()
  const accounts = useRecoilValue(selectedSubstrateAccountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])
  const balances = useRecoilValue(
    waitForAll(addresses.map(address => chainDeriveState(apiId, 'balances', 'all', [address])))
  )
  const total = useMemo(
    () => balances.reduce((prev, curr) => prev + curr.freeBalance.toBigInt() + curr.reservedBalance.toBigInt(), 0n),
    [balances]
  )
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
  const chain = useContext(ChainContext)
  return (
    <StakeProvider
      symbol={chain.nativeToken.symbol}
      logo={chain.nativeToken.logo}
      chain={chain.name}
      apr={
        <Suspense fallback={<CircularProgressIndicator size="1em" />}>
          <Apr />
        </Suspense>
      }
      type="Nomination pools"
      provider={chain.name}
      unbondingPeriod={
        <Suspense fallback={<CircularProgressIndicator size="1em" />}>
          <UnlockDuration />
        </Suspense>
      }
      availableBalance={
        <Suspense fallback={<CircularProgressIndicator size="1em" />}>
          <AvailableBalance />
        </Suspense>
      }
      availableFiatBalance={
        <Suspense>
          <AvailableFiatBalance />
        </Suspense>
      }
      stakePercentage={
        <Suspense fallback={<StakeProvider.StakePercentage loading />}>
          <StakePercentage />
        </Suspense>
      }
      stakeButton={<StakeProvider.StakeButton as={Link} to="?action=stake&type=nomination-pools" />}
    />
  )
}

const StakeProviders = () => {
  return (
    <>
      {useRecoilValue(chainsState).map((chain, index) => (
        <ChainProvider key={index} chain={chain}>
          <StakeProviderItem />
        </ChainProvider>
      ))}
    </>
  )
}

export default StakeProviders