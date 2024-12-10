import { type ComponentMeta, type Story } from '@storybook/react'

import type { RemoveWatchedAccountConfirmationDialogProps } from './RemoveWatchedAccountConfirmationDialog'
import { RemoveWatchedAccountConfirmationDialog } from './RemoveWatchedAccountConfirmationDialog'

export default {
  title: 'Recipes/RemoveWatchedAccountConfirmationDialog',
  component: RemoveWatchedAccountConfirmationDialog,
} as ComponentMeta<typeof RemoveWatchedAccountConfirmationDialog>

export const Default: Story<RemoveWatchedAccountConfirmationDialogProps> = args => (
  <RemoveWatchedAccountConfirmationDialog {...args} />
)

Default.args = {
  open: true,
  name: 'Jaco',
}
