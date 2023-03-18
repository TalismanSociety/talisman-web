import { ComponentMeta, Story } from '@storybook/react'
import { Select } from '@talismn/ui'

import StakingInput, { StakingInputProps } from './StakingInput'
import StakingInputSkeleton from './StakingInput.skeleton'

export default {
  title: 'Recipes/StakingInput',
  component: StakingInput,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof StakingInput>

export const Default: Story<StakingInputProps> = args => (
  <div css={{ width: '40rem' }}>
    <StakingInput {...args} />
  </div>
)

Default.args = {
  accountSelector: (
    <Select width="100%" placeholder="Select account">
      <Select.Item headlineText="foo" />
    </Select>
  ),
  amount: '',
  fiatAmount: '$4,261.23',
  availableToStake: '420 DOT',
  poolName: 'Bingbong pool',
  poolTotalStaked: '24,054.55 DOT',
  poolMemberCount: '17',
}

export const AlreadyStaking = Default.bind({})

AlreadyStaking.args = { ...Default.args, alreadyStaking: true }

export const NoPoolsAvailable = Default.bind({})

NoPoolsAvailable.args = { ...Default.args, noPoolsAvailable: true }

export const Skeleton = () => (
  <div css={{ width: '40rem' }}>
    <StakingInputSkeleton />
  </div>
)
