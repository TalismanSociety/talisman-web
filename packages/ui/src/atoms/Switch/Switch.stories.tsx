import Switch from './Switch'
import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Atoms/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Switch>

type Story = StoryObj<typeof Switch>

export const Default: Story = {}
