import { selectedSubstrateAccountsState } from '@domains/accounts'
import { usePoolStakes } from '@domains/nominationPools/hooks'
import { useRecoilValue } from 'recoil'
import PoolStakeItem from './PoolStakeItem'
import ErrorBoundary from '../ErrorBoundary'

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
