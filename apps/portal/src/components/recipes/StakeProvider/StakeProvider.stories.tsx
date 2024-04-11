import { type Meta, type StoryObj } from '@storybook/react'
import StakeProvider from './StakeProvider'

export default {
  title: 'Recipes/StakeProvider',
  component: StakeProvider,
} satisfies Meta<typeof StakeProvider>

type Story = StoryObj<typeof StakeProvider>

export const Default: Story = {
  args: {
    symbol: 'DOT',
    chain: 'Polkadot',
    type: 'Nomination pools',
    provider: 'Polkadot',
    unbondingPeriod: '10 days',
    apr: '5.5 - 5.6',
    availableBalance: '10 DOT',
    availableFiatBalance: '$50',
    stakePercentage: 0.55,
    stakeButton: <StakeProvider.StakeButton />,
  },
}
