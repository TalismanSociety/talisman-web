import { type Meta, type StoryObj } from '@storybook/react'

import AccountIcon from './AccountIcon'

export default {
  title: 'Molecules/AccountIcon',
  component: AccountIcon,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AccountIcon>

type Story = StoryObj<typeof AccountIcon>

export const Default: Story = {
  args: {
    account: {
      name: 'Foo',
      address: 'bar',
    },
  },
}

export const Readonly: Story = {
  args: {
    account: {
      name: 'Foo',
      address: 'bar',
      readonly: true,
      partOfPortfolio: false,
    },
  },
}
