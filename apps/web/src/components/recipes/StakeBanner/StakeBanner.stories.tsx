import { type Meta, type StoryObj } from '@storybook/react'

import StakeBanner from './StakeBanner'

export default {
  title: 'Recipes/StakeBanner',
  component: StakeBanner,
} satisfies Meta<typeof StakeBanner>

type Story = StoryObj<typeof StakeBanner>

export const Default: Story = {
  args: { balance: '$69', rewards: '$69' },
}
