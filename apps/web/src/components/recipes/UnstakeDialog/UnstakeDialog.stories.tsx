import { type ComponentMeta, type Story } from '@storybook/react'

import UnstakeDialog, { type UnstakeDialogProps } from './UnstakeDialog'

export default {
  title: 'Recipes/UnstakeDialog',
  component: UnstakeDialog,
} as ComponentMeta<typeof UnstakeDialog>

export const Default: Story<UnstakeDialogProps> = args => <UnstakeDialog {...args} />

Default.args = {
  open: true,
  availableAmount: '420 DOT',
  amount: '1 DOT',
  fiatAmount: '$1.00',
  newAmount: '4040 DOT',
  newFiatAmount: '$24926.80',
  lockDuration: '28 days',
}
