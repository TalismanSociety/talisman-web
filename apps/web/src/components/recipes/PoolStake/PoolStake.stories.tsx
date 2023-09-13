import { type ComponentMeta, type Story } from '@storybook/react'

import PoolStake, { PoolStakeList, type PoolStakeProps } from './PoolStake'
import PoolStakeSkeleton from './PoolStake.skeleton'

export default {
  title: 'Recipes/PoolStake',
  component: PoolStake,
} as ComponentMeta<typeof PoolStake>

export const Default: Story<PoolStakeProps> = args => <PoolStake {...args} />

Default.args = {
  account: {
    name: 'Yeet account',
    address: '143wN4e1nTTWJZHy1CFVXDHpAg6YJsNn2jDN52J2Xfjf8MWs',
  },
  stakingAmount: '4000 DOT',
  stakingAmountInFiat: '$23,988.55',
  rewardsAmount: '+4 DOT',
  rewardsAmountInFiat: '+$120.55',
  poolName: 'Talisman Paraverse Pool',
  claimState: undefined,
}

export const Compact = Default.bind({})

Compact.args = { ...Default.args, variant: 'compact' }

export const List: Story<PoolStakeProps> = args => (
  <PoolStakeList>
    <PoolStake {...args} />
    <PoolStake {...args} />
    <PoolStake {...args} />
    <PoolStakeSkeleton />
    <PoolStakeSkeleton />
    <PoolStakeSkeleton />
  </PoolStakeList>
)

List.args = {
  account: {
    name: 'Yeet account',
    address: '143wN4e1nTTWJZHy1CFVXDHpAg6YJsNn2jDN52J2Xfjf8MWs',
  },
  stakingAmount: '4000 DOT',
  stakingAmountInFiat: '$23,988.55',
  rewardsAmount: '+4 DOT',
  rewardsAmountInFiat: '+$120.55',
  poolName: 'Talisman Paraverse Pool',
}

export const Skeleton = () => <PoolStakeSkeleton />
