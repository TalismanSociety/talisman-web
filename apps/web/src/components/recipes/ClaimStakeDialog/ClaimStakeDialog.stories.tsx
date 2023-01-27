import { ComponentMeta, Story } from '@storybook/react'

import ClaimStakeDialog, { ClaimStakeDialogProps } from './ClaimStakeDialog'

export default {
  title: 'Recipes/ClaimStakeDialog',
  component: ClaimStakeDialog,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof ClaimStakeDialog>

export const Default: Story<ClaimStakeDialogProps> = args => <ClaimStakeDialog {...args} />

Default.args = {
  open: true,
  amount: '120 DOT',
  fiatAmount: '$420.00',
  lockDuration: '18 days',
}
