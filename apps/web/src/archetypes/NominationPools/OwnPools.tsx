import PoolStake, { PoolStakeList } from '@components/recipes/PoolStake/PoolStake'
import { useTotalStaked } from '@domains/staking/hooks'
import { useTheme } from '@emotion/react'
import { Text } from '@talismn/ui'
import { Suspense } from 'react'

import Stakings from './Stakings'
import ValidatorStakings from './ValidatorStakings'

const StakingHeader = () => {
  const theme = useTheme()
  const totalStaked = useTotalStaked()
  return (
    <header>
      <Text.H4 css={{ marginBottom: '2.4rem' }}>
        Staking
        <span css={{ color: theme.color.primary, marginLeft: '0.85em' }}>{totalStaked.localizedFiatAmount}</span>
      </Text.H4>
    </header>
  )
}

const OwnPools = () => (
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
      <div>
        <StakingHeader />
        <div
          css={{
            'display': 'flex',
            'flexDirection': 'column',
            'gap': '1.6rem',
            '> *:empty': {
              display: 'none',
            },
          }}
        >
          <ValidatorStakings />
          <Stakings />
        </div>
      </div>
    </Suspense>
  </div>
)

export default OwnPools
