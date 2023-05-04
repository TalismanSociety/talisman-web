import { selectedSubstrateAccountsState } from '@domains/accounts'
import { usePoolStakes } from '@domains/nominationPools/hooks'
import { useRecoilValue } from 'recoil'
import PoolStakeItem from './PoolStakeItem'

const PoolStakes = () => {
  const pools = usePoolStakes(useRecoilValue(selectedSubstrateAccountsState))

  return (
    <>
      {pools?.map((pool, index) => (
        <PoolStakeItem key={index} item={pool} />
      ))}
    </>
  )
}

export default PoolStakes
