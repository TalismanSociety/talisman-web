import { type Meta, type StoryObj } from '@storybook/react'

import StakeDetails from './StakeDetails'

export default {
  title: 'Recipes/StakeDetails',
  component: StakeDetails,
} satisfies Meta<typeof StakeDetails>

type Story = StoryObj<typeof StakeDetails>

export const Default: Story = {}
