import { type ComponentMeta, type Story } from '@storybook/react'

import PoolStakeItem, { type PoolStakeItemProps } from './PoolStakeItem'
import StakeItem from './StakeItem'
import ValidatorStakeItem, { type ValidatorStakeItemProps } from './ValidatorStakeItem'

export default {
  title: 'Recipes/StakeItem',
  component: StakeItem,
} as ComponentMeta<typeof StakeItem>

const defaultProps = {
  accountName: 'Dev wallet',
  accountAddress: '1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS',
  poolName: 'Talisman Pool 1: app.talisman.xyz',
  stakingAmount: '3,013.33 DOT',
  stakingFiatAmount: '$24,358.05',
}

export const PoolStake: Story<PoolStakeItemProps> = args => <PoolStakeItem {...args} />

PoolStake.args = {
  ...defaultProps,
  claimChip: <PoolStakeItem.ClaimChip key="0" amount="104.96 DOT" />,
  unstakeChip: <PoolStakeItem.UnstakeChip key="1" />,
  increaseStakeChip: <PoolStakeItem.IncreaseStakeChip key="2" />,
  status: (
    <PoolStakeItem.UnstakingStatus
      amount="1 DOT"
      unlocks={[
        { amount: '1 DOT', eta: '11 hours 24 minutes' },
        { amount: '1 DOT', eta: '11 hours 24 minutes' },
        { amount: '1 DOT', eta: '11 hours 24 minutes' },
      ]}
    />
  ),
}

export const ValidatorStake: Story<ValidatorStakeItemProps> = args => <ValidatorStakeItem {...args} />

ValidatorStake.args = {
  ...defaultProps,
  unstakeChip: <ValidatorStakeItem.UnstakeChip key="1" />,
  status: (
    <ValidatorStakeItem.UnstakingStatus
      amount="1 DOT"
      unlocks={[
        { amount: '1 DOT', eta: '11 hours 24 minutes' },
        { amount: '1 DOT', eta: '11 hours 24 minutes' },
        { amount: '1 DOT', eta: '11 hours 24 minutes' },
      ]}
    />
  ),
}

export const ValidatorStakeWithFastUnstake = ValidatorStake.bind({})

ValidatorStakeWithFastUnstake.args = {
  ...defaultProps,
  unstakeChip: <ValidatorStakeItem.FastUnstakeChip />,
  status: (
    <ValidatorStakeItem.UnstakingStatus
      amount="1 DOT"
      unlocks={[
        { amount: '1 DOT', eta: '11 hours 24 minutes' },
        { amount: '1 DOT', eta: '11 hours 24 minutes' },
        { amount: '1 DOT', eta: '11 hours 24 minutes' },
      ]}
    />
  ),
}

export const ValidatorStakeWithFastUnstakeQueue = ValidatorStake.bind({})

ValidatorStakeWithFastUnstake.args = {
  ...defaultProps,
  unstakeChip: <ValidatorStakeItem.FastUnstakeChip />,
  status: <ValidatorStakeItem.FastUnstakingStatus amount="1 DOT" status="in-head" />,
}

export const Skeleton = () => <StakeItem.Skeleton />
