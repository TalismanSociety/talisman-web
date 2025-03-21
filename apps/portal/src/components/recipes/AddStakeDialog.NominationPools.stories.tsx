import { type ComponentMeta, type Story } from '@storybook/react'

import type { NominationPoolsAddStakeDialogProps } from './AddStakeDialog'
import { NominationPoolsAddStakeDialog } from './AddStakeDialog'

export default {
  title: 'Recipes/AddStakeDialog/NominationPools',
  component: NominationPoolsAddStakeDialog,
} as ComponentMeta<typeof NominationPoolsAddStakeDialog>

export const Default: Story<NominationPoolsAddStakeDialogProps> = args => <NominationPoolsAddStakeDialog {...args} />

Default.args = {
  open: true,
  availableToStake: '420 DOT',
  amount: '1 DOT',
  fiatAmount: '$1.00',
  newAmount: '4040 DOT',
  newFiatAmount: '$24926.80',
}
