import { DANGEROUS_SELECTED_SUBSTRATE_ACCOUNTS_STATE } from '@domains/accounts'
import { usePoolStakes } from '@domains/nominationPools/hooks'
import { useRecoilValue } from 'recoil'
import PoolStakeItem from './PoolStakeItem'

const PoolStakes = () => {
  const pools = usePoolStakes(useRecoilValue(DANGEROUS_SELECTED_SUBSTRATE_ACCOUNTS_STATE))

  return (
    <>
      {pools?.map((pool, index) => (
        <PoolStakeItem key={index} item={pool} />
      ))}
    </>
  )
}

export default PoolStakes
