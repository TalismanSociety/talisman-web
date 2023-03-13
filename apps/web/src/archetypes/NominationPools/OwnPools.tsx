import SectionHeader from '@components/molecules/SectionHeader'
import StakeItem from '@components/recipes/StakeItem'
import AnimatedFiatNumber from '@components/widgets/AnimatedFiatNumber'
import { useTotalStaked } from '@domains/staking/hooks'
import { Suspense } from 'react'

import Stakings from './Stakings'
import ValidatorStakings from './ValidatorStakings'

const StakingHeader = () => {
  const totalStaked = useTotalStaked()

  return (
    <SectionHeader headlineText="Staking" supportingText={<AnimatedFiatNumber end={totalStaked.fiatAmount ?? 0} />} />
  )
}

const OwnPools = () => (
  <div id="staking">
    <Suspense
      fallback={
        <div>
          <SectionHeader headlineText="Staking" />
          <section css={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
            <StakeItem.Skeleton />
            <StakeItem.Skeleton />
          </section>
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
