import type { Meta, StoryObj } from '@storybook/react'

import TalismanHandProgressIndicator from './TalismanHandProgressIndicator'

export default {
  component: TalismanHandProgressIndicator,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TalismanHandProgressIndicator>

type Story = StoryObj<typeof TalismanHandProgressIndicator>

export const Default: Story = {}
