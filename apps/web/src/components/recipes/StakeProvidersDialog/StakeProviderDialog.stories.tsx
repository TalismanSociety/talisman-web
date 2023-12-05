import { type Meta, type StoryObj } from '@storybook/react'
import StakeProviderDialog from './StakeProviderDialog'

export default {
  title: 'Recipes/StakeProviderDialog',
  component: StakeProviderDialog,
} satisfies Meta<typeof StakeProviderDialog>

type Story = StoryObj<typeof StakeProviderDialog>

export const Default: Story = {
  args: {
    title: 'DOT staking',
    children: [
      <StakeProviderDialog.Option
        key={0}
        name="Nomination pools"
        description="A native staking provider for Polkadot that facilitates secure, decentralized token staking, optimizing rewards and ensuring network participation and validation."
        onSelect={() => {}}
      />,
      <StakeProviderDialog.Option
        key={1}
        name="Nomination pools"
        description="A native staking provider for Polkadot that facilitates secure, decentralized token staking, optimizing rewards and ensuring network participation and validation."
        onSelect={() => {}}
      />,
      <StakeProviderDialog.Option
        key={2}
        name="Nomination pools"
        description="A native staking provider for Polkadot that facilitates secure, decentralized token staking, optimizing rewards and ensuring network participation and validation."
        onSelect={() => {}}
      />,
    ],
  },
}
