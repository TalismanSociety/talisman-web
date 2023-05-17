import { type ComponentMeta, type Story } from '@storybook/react'

import AddStakeDialog, { type AddStakeDialogProps } from './AddStakeDialog'

export default {
  title: 'Recipes/AddStakeDialog',
  component: AddStakeDialog,
} as ComponentMeta<typeof AddStakeDialog>

export const Default: Story<AddStakeDialogProps> = args => <AddStakeDialog {...args} />

Default.args = {
  open: true,
  availableToStake: '420 DOT',
  amount: '1 DOT',
  fiatAmount: '$1.00',
  newAmount: '4040 DOT',
  newFiatAmount: '$24926.80',
}
