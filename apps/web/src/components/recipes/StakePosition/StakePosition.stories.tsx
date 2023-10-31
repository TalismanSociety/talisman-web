import { type Meta, type StoryObj } from '@storybook/react'
import StakePosition from './StakePosition'

export default {
  title: 'Recipes/StakePosition',
  component: StakePosition,
} satisfies Meta<typeof StakePosition>

type Story = StoryObj<typeof StakePosition>

export const Default: Story = {
  args: {
    account: { name: 'Account 1', address: 'foo' },
    stakeStatus: 'earning_rewards',
    provider: 'Talisman pool 1',
    increaseStakeButton: <StakePosition.IncreaseStakeButton />,
    unstakeButton: <StakePosition.UnstakeButton />,
    statisticsButton: <StakePosition.StatisticsButton />,
    claimButton: <StakePosition.ClaimButton amount="1 DOT" />,
    withdrawButton: <StakePosition.WithdrawButton amount="1 DOT" />,
    status: (
      <StakePosition.UnstakingStatus
        amount="1 DOT"
        unlocks={[
          { amount: '1 DOT', eta: '11 hours 24 minutes' },
          { amount: '1 DOT', eta: '11 hours 24 minutes' },
          { amount: '1 DOT', eta: '11 hours 24 minutes' },
        ]}
      />
    ),
  },
}

export const Multiple: Story = {
  render: () => (
    <div>
      <StakePosition {...(Default.args as any)} />
      <StakePosition {...(Default.args as any)} status={undefined} withdrawButton={undefined} />
      <StakePosition {...(Default.args as any)} readonly />
      <StakePosition {...(Default.args as any)} status={undefined} statisticsButton={undefined} />
    </div>
  ),
}
