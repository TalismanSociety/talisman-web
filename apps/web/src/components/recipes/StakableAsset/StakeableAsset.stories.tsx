import { type Meta, type StoryObj } from '@storybook/react'
import StakeableAsset from './StakeableAsset'

export default {
  title: 'Recipes/StakeableAsset',
  component: StakeableAsset,
} satisfies Meta<typeof StakeableAsset>

type Story = StoryObj<typeof StakeableAsset>

export const Default: Story = {
  args: {
    symbol: 'DOT',
    chain: 'Polkadot',
    type: 'Nomination pools',
    provider: 'Polkadot',
    apr: '5.5 - 5.6',
    availableBalance: '10 DOT',
    availablePercentage: 0.55,
    stakeButton: <StakeableAsset.StakeButton />,
  },
}
