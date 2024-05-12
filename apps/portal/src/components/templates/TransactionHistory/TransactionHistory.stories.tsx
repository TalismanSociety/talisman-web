import TransactionHistory from './TransactionHistory'
import { type Meta, type StoryObj } from '@storybook/react'

export default {
  title: 'Templates/TransactionHistory',
  component: TransactionHistory,
} satisfies Meta<typeof TransactionHistory>

type Story = StoryObj<typeof TransactionHistory>

export const Default: Story = {}
