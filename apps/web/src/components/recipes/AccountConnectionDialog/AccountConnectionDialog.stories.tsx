import { ComponentMeta, Story } from '@storybook/react'

import AccountConnectionDialog, { AccountConnectionDialogProps } from './AccountConnectionDialog'

export default {
  title: 'Recipes/AccountConnectionDialog',
  component: AccountConnectionDialog,
} as ComponentMeta<typeof AccountConnectionDialog>

export const Default: Story<AccountConnectionDialogProps> = args => <AccountConnectionDialog {...args} />

Default.args = {
  open: true,
}
