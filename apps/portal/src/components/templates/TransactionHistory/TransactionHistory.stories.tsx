import { type Meta, type StoryObj } from '@storybook/react'

import TransactionHistory from './TransactionHistory'

export default {
  title: 'Recipes/TransactionHistory',
  component: TransactionHistory,
} satisfies Meta<typeof TransactionHistory>

type Story = StoryObj<typeof TransactionHistory>

export const Default: Story = {}
