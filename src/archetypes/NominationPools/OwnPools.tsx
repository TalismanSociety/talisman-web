import Text from '@components/atoms/Text'
import PoolStake, { PoolStakeList } from '@components/recipes/PoolStake/PoolStake'
import { Suspense } from 'react'

import Stakings from './Stakings'
import Unstakings from './Unstakings'

const OwnPools = () => {
  return (
    <div id="staking">
      <Suspense
        fallback={
          <div>
            <header>
              <Text.H4>Staking</Text.H4>
              <PoolStakeList>
                <PoolStake.Skeleton />
                <PoolStake.Skeleton />
                <PoolStake.Skeleton />
              </PoolStakeList>
            </header>
          </div>
        }
      >
        <Stakings />
        <Unstakings />
      </Suspense>
    </div>
  )
}

export default OwnPools
