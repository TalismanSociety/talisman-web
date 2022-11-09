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
              <Text.H4 css={{ marginBottom: '2.4rem' }}>Staking</Text.H4>
            </header>
            <PoolStakeList>
              <PoolStake.Skeleton />
              <PoolStake.Skeleton />
              <PoolStake.Skeleton />
            </PoolStakeList>
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
