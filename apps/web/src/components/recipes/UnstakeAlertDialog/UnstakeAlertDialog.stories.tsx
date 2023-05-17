import { type ComponentMeta, type Story } from '@storybook/react'

import UnstakeAlertDialog, { type UnstakeAlertDialogProps } from './UnstakeAlertDialog'

export default {
  title: 'Recipes/UnstakeAlertDialog',
  component: UnstakeAlertDialog,
} as ComponentMeta<typeof UnstakeAlertDialog>

export const Default: Story<UnstakeAlertDialogProps> = args => <UnstakeAlertDialog {...args} />

Default.args = {
  open: true,
  amount: '1 DOT',
  fiatAmount: '$1.00',
  lockDuration: '28 days',
}
