import { type ComponentMeta, type Story } from '@storybook/react'

import ValidatorStake, { ValidatorStakeList, type ValidatorStakeProps } from './ValidatorStake'
import ValidatorStakeSkeleton from './ValidatorStake.skeleton'

export default {
  title: 'Recipes/ValidatorStake',
  component: ValidatorStake,
} as ComponentMeta<typeof ValidatorStake>

export const Default: Story<ValidatorStakeProps> = args => <ValidatorStake {...args} />

Default.args = {
  account: { name: 'Yeet account', address: '143wN4e1nTTWJZHy1CFVXDHpAg6YJsNn2jDN52J2Xfjf8MWs' },
  stakingAmount: '4000 DOT',
  stakingAmountInFiat: '$23,988.55',
}

export const NotEarningRewards = Default.bind({})

NotEarningRewards.args = { ...Default.args, notEarningRewards: true }

export const List: Story<ValidatorStakeProps> = args => (
  <ValidatorStakeList>
    <ValidatorStake {...args} />
    <ValidatorStake {...args} />
    <ValidatorStake {...args} />
    <ValidatorStakeSkeleton />
    <ValidatorStakeSkeleton />
    <ValidatorStakeSkeleton />
  </ValidatorStakeList>
)

List.args = {
  account: { name: 'Yeet account', address: '143wN4e1nTTWJZHy1CFVXDHpAg6YJsNn2jDN52J2Xfjf8MWs' },
  stakingAmount: '4000 DOT',
  stakingAmountInFiat: '$23,988.55',
}

export const Skeleton = () => <ValidatorStakeSkeleton />
