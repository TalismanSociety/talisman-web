import { type ComponentMeta, type Story } from '@storybook/react'

import type { DappStakingLockedAmountDialogProps } from './DappStakingLockedAmountDialog'
import { DappStakingLockedAmountDialog } from './DappStakingLockedAmountDialog'

export default {
  title: 'Recipes/DappStakingLockedAmountDialog',
  component: DappStakingLockedAmountDialog,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof DappStakingLockedAmountDialog>

export const Default: Story<DappStakingLockedAmountDialogProps> = args => <DappStakingLockedAmountDialog {...args} />

Default.args = {
  amount: '120 DOT',
  fiatAmount: '$420.00',
  unlockDuration: '1 day',
}
