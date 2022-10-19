import { ComponentMeta, Story } from '@storybook/react'

import PoolStake, { PoolStakeProps } from './PoolStake'

export default {
  title: 'Recipes/PoolStake',
  component: PoolStake,
} as ComponentMeta<typeof PoolStake>

export const Default: Story<PoolStakeProps> = args => <PoolStake {...args} />

Default.args = {
  accountName: 'Yeet account',
  accountAddress: '(13Kcw...ZQ4K)',
  stakingAmount: '4000 DOT',
  stakingAmountInFiat: '$23,988.55',
  rewardsAmount: '+4 DOT',
  rewardsAmountInFiat: '+$120.55',
  poolName: 'Talisman Paraverse Pool',
}
