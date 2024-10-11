import { selectedSubstrateAccountsState } from '../../../../domains/accounts'
import { ChainProvider, subtensorStakingEnabledChainsState, useChainState } from '../../../../domains/chains'
import {
  chainDeriveState,
  chainQueryState,
  substrateApiState,
  useTokenAmountFromPlanck,
} from '../../../../domains/common'
import { useAprFormatted } from '../../../../domains/staking/subtensor/hooks/useApr'
import StakeProvider from '../../../recipes/StakeProvider'
import AnimatedFiatNumber from '../../AnimatedFiatNumber'
import ErrorBoundary from '../../ErrorBoundary'
import RedactableBalance from '../../RedactableBalance'
import ErrorBoundaryFallback from '../ErrorBoundaryFallback'
import UnlockDuration from './UnlockDuration'
import { Decimal } from '@talismn/math'
import { usePolkadotApiId } from '@talismn/react-polkadot-api'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue, waitForAll } from 'recoil'

const Apr = ({ genesisHash }: { genesisHash?: string }) => <>{useAprFormatted(genesisHash)}</>

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
  const free = useMemo(() => balances.reduce((prev, curr) => prev + curr.freeBalance.toBigInt(), 0n), [balances])
  const chain = useRecoilValue(useChainState())
  const ledgers = useRecoilValue(
    // @ts-expect-error
    waitForAll(addresses.map(address => chainQueryState(chain.rpc, 'subtensorModule', 'totalColdkeyStake', [address])))
  )
  const staked = useMemo(() => ledgers.reduce((prev, curr: any) => prev + curr?.toBigInt?.(), 0n), [ledgers])
  const total = useMemo(() => free + staked, [free, staked])

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
        chainId={chain?.id}
        apr={<Apr genesisHash={chain.genesisHash} />}
        type="Delegation"
        provider={name}
        unbondingPeriod={<UnlockDuration />}
        availableBalance={<AvailableBalance />}
        availableFiatBalance={<AvailableFiatBalance />}
        stakePercentage={<StakePercentage />}
        stakeButton={
          <StakeProvider.StakeButton as={Link} to={`?action=stake&type=subtensor&chain=${chain?.id ?? ''}`} />
        }
      />
    </ErrorBoundary>
  )
}

const StakeProviders = () => {
  const chains = useRecoilValue(subtensorStakingEnabledChainsState)

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
