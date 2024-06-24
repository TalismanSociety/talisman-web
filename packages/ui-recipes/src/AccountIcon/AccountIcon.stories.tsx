import AccountIcon from './AccountIcon'
import { type Meta, type StoryObj } from '@storybook/react'

export default {
  component: AccountIcon,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AccountIcon>

type Story = StoryObj<typeof AccountIcon>

export const Default: Story = {
  args: {
    address: 'bar',
  },
}

export const Readonly: Story = {
  args: {
    address: 'bar',
    readonly: true,
  },
}
