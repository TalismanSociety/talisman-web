import { type Meta, type StoryObj } from '@storybook/react'
import StakeDashboard from './StakeDashboard'

export default {
  title: 'Templates/StakeDashboard',
  component: StakeDashboard,
} satisfies Meta<typeof StakeDashboard>

type Story = StoryObj<typeof StakeDashboard>

export const Default: Story = {}
