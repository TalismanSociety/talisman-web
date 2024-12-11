import { type ComponentMeta, type Story } from '@storybook/react'

import type { WithdrawCrowdloanDialogProps } from './WithdrawCrowdloanDialog'
import { WithdrawCrowdloanDialog } from './WithdrawCrowdloanDialog'

export default {
  title: 'Recipes/WithdrawCrowdloanDialog',
  component: WithdrawCrowdloanDialog,
} as ComponentMeta<typeof WithdrawCrowdloanDialog>

export const Default: Story<WithdrawCrowdloanDialogProps> = args => <WithdrawCrowdloanDialog {...args} />

Default.args = {
  open: true,
}
