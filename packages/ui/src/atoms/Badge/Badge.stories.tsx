import type { Meta, StoryObj } from '@storybook/react'

import Badge, { BadgedBox } from './Badge'
import { Eye, Mail } from '@talismn/icons'
import { FloatingActionButton } from '..'

export default {
  component: Badge,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Badge>

type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    children: 1,
  },
}

export const Long: Story = {
  args: {
    children: '999+',
  },
}

export const Icon: Story = {
  args: {
    children: <Eye />,
  },
}

export const Container: Story = {
  render: () => (
    <BadgedBox badge={<Badge>999+</Badge>}>
      <FloatingActionButton>
        <Mail />
      </FloatingActionButton>
    </BadgedBox>
  ),
}
