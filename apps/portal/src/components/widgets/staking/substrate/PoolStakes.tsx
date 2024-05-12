import { selectedSubstrateAccountsState } from '../../../../domains/accounts'
import { usePoolStakes } from '../../../../domains/staking/substrate/nominationPools/hooks'
import ErrorBoundary from '../../ErrorBoundary'
import PoolStakeItem from './PoolStakeItem'
import { useRecoilValue } from 'recoil'

const PoolStakes = () => {
  const pools = usePoolStakes(useRecoilValue(selectedSubstrateAccountsState))

  return (
    <>
      {pools?.map((pool, index) => (
        <ErrorBoundary key={index} orientation="horizontal">
          <PoolStakeItem item={pool} />
        </ErrorBoundary>
      ))}
    </>
  )
}

export default PoolStakes
