import type { LinearProgressIndicatorProps } from './LinearProgressIndicator'
import LinearProgressIndicator from './LinearProgressIndicator'
import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Atoms/LinearProgressIndicator',
  component: LinearProgressIndicator,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div css={{ minWidth: '18rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<LinearProgressIndicatorProps>

type Story = StoryObj<LinearProgressIndicatorProps>

export const Default: Story = {
  args: {
    value: 0.5,
    optimum: 0.5,
  },
}
