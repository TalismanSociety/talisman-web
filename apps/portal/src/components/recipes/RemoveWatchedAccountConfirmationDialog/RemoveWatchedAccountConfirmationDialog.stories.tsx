import RemoveWatchedAccountConfirmationDialog, {
  type RemoveWatchedAccountConfirmationDialogProps,
} from './RemoveWatchedAccountConfirmationDialog'
import { type ComponentMeta, type Story } from '@storybook/react'

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
