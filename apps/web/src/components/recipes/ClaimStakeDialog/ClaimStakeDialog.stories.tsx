import { ComponentMeta, Story, type, type } from '@storybook/react'

import ClaimStakeDialog, { ClaimStakeDialogProps, type } from './ClaimStakeDialog'

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
}
