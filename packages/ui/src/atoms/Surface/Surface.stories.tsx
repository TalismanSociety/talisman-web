import type { SurfaceProps } from './Surface'
import Surface from './Surface'
import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Atoms/Surface',
  component: Surface,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<SurfaceProps>

type Story = StoryObj<SurfaceProps>

export const Default: Story = {
  render: () => (
    <Surface css={{ padding: 50 }}>
      <Surface css={{ padding: 50 }}>
        <Surface css={{ padding: 50 }}>
          <Surface css={{ padding: 50 }}>
            <Surface css={{ padding: 50 }} />
          </Surface>
        </Surface>
      </Surface>
    </Surface>
  ),
}
