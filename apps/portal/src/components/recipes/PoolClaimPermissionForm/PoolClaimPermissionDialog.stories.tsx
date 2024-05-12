import { PoolClaimPermissionDialog } from './PoolClaimPermissionForm'
import { Default as DefaultFormStory } from './PoolClaimPermissionForm.stories'
import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Recipes/PoolClaimPermissionForm/Dialog',
  component: PoolClaimPermissionDialog,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PoolClaimPermissionDialog>

type Story = StoryObj<typeof PoolClaimPermissionDialog>

export const Default: Story = {
  render: () => (
    <PoolClaimPermissionDialog onRequestDismiss={() => {}}>
      {DefaultFormStory.render?.(DefaultFormStory.args as any, {} as any)}
    </PoolClaimPermissionDialog>
  ),
}
