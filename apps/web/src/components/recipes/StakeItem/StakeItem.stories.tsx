import { ComponentMeta, Story } from '@storybook/react'
import { Clock } from '@talismn/icons'

import PoolStakeItem, { PoolStakeItemProps } from './PoolStakeItem'
import StakeItem, { ClaimChip, FastUnstakeChip, IncreaseStakeChip, UnstakeChip } from './StakeItem'
import ValidatorStakeItem, { ValidatorStakeItemProps } from './ValidatorStakeItem'

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
  claimChip: <ClaimChip key="0" amount="104.96 DOT" />,
  unstakeChip: <UnstakeChip key="1" />,
  increaseStakeChip: <IncreaseStakeChip key="2" />,
  status: (
    <>
      <Clock size="1em" /> Unstaking 14d 8hr 11min
    </>
  ),
}

export const ValidatorStake: Story<ValidatorStakeItemProps> = args => <ValidatorStakeItem {...args} />

ValidatorStake.args = {
  ...defaultProps,
  unstakeChip: <UnstakeChip key="1" />,
  status: (
    <>
      <Clock size="1em" /> Unstaking 14d 8hr 11min
    </>
  ),
}

export const ValidatorStakeWithFastUnstake = ValidatorStake.bind({})

ValidatorStakeWithFastUnstake.args = {
  ...defaultProps,
  unstakeChip: <FastUnstakeChip />,
  status: (
    <>
      <Clock size="1em" /> Unstaking 14d 8hr 11min
    </>
  ),
}

export const Skeleton = () => <StakeItem.Skeleton />
