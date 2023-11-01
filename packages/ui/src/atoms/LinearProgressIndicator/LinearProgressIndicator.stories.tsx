import type { Meta, StoryObj } from '@storybook/react'
import type { LinearProgressIndicatorProps } from './LinearProgressIndicator'
import LinearProgressIndicator from './LinearProgressIndicator'

export default {
  title: 'Atoms/LinearProgressIndicator',
  component: LinearProgressIndicator,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<LinearProgressIndicatorProps>

type Story = StoryObj<LinearProgressIndicatorProps>

export const Default: Story = {
  args: {
    value: 0.5,
    optimum: 0.5,
  },
}
