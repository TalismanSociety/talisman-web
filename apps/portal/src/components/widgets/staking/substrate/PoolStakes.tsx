import { selectedSubstrateAccountsState } from '../../../../domains/accounts'
import { usePoolStakes } from '../../../../domains/staking/substrate/nominationPools/hooks'
import PoolStakeItem from './PoolStakeItem'
import { useRecoilValue } from 'recoil'

const PoolStakes = () => {
  const pools = usePoolStakes(useRecoilValue(selectedSubstrateAccountsState))

  return (
    <>
      {pools?.map((pool, index) => (
        <PoolStakeItem item={pool} key={index} />
      ))}
    </>
  )
}

export default PoolStakes
