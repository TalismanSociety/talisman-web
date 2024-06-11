import { selectedSubstrateAccountsState } from '../../../../domains/accounts'
import { usePoolStakeLoadable } from '../../../../domains/staking/substrate/nominationPools/hooks'
import PoolStakeItem from './PoolStakeItem'
import { useRecoilValue } from 'recoil'

type PoolStakeProps = {
  setShouldRenderLoadingSkeleton: React.Dispatch<React.SetStateAction<boolean>>
}

const PoolStakes = ({ setShouldRenderLoadingSkeleton }: PoolStakeProps) => {
  const { data: pools, state } = usePoolStakeLoadable(useRecoilValue(selectedSubstrateAccountsState))

  if (state === 'hasValue' && pools.length) {
    setShouldRenderLoadingSkeleton(false)
  }

  return (
    <>
      {pools?.map((pool, index) => (
        <PoolStakeItem item={pool} key={index} />
      ))}
    </>
  )
}

export default PoolStakes
