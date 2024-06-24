import { selectedSubstrateAccountsState } from '../../../../domains/accounts'
import { useChainState } from '../../../../domains/chains'
import { usePoolStakeLoadable } from '../../../../domains/staking/substrate/nominationPools/hooks'
import ErrorBoundary from '../../ErrorBoundary'
import PoolStakeItem from './PoolStakeItem'
import { StakePositionErrorBoundary } from '@talismn/ui-recipes'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

type PoolStakeProps = {
  setShouldRenderLoadingSkeleton: React.Dispatch<React.SetStateAction<boolean>>
}

const PoolStakes = ({ setShouldRenderLoadingSkeleton }: PoolStakeProps) => {
  const { data: pools, state } = usePoolStakeLoadable(useRecoilValue(selectedSubstrateAccountsState))
  const chainLoadable = useRecoilValueLoadable(useChainState())
  const chain = chainLoadable.valueMaybe()

  if (state === 'hasValue' || pools.length) {
    setShouldRenderLoadingSkeleton(false)
  }

  const { name = '', nativeToken: { symbol, logo } = { symbol: '', logo: '' } } = chain || {}

  return (
    <>
      {pools?.map((pool, index) => (
        <ErrorBoundary
          orientation="horizontal"
          key={index}
          renderFallback={() => (
            <StakePositionErrorBoundary
              chain={name}
              assetSymbol={symbol}
              assetLogoSrc={logo}
              account={pool.account}
              provider={pool.poolName ?? ''}
              stakeStatus={pool.status}
            />
          )}
        >
          <PoolStakeItem item={pool} />
        </ErrorBoundary>
      ))}
    </>
  )
}

export default PoolStakes
