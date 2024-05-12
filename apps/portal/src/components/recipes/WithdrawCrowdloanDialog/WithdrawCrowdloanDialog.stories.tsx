import { WithdrawCrowdloanDialog, type WithdrawCrowdloanDialogProps } from './WithdrawCrowdloanDialog'
import { type ComponentMeta, type Story } from '@storybook/react'

export default {
  title: 'Recipes/WithdrawCrowdloanDialog',
  component: WithdrawCrowdloanDialog,
} as ComponentMeta<typeof WithdrawCrowdloanDialog>

export const Default: Story<WithdrawCrowdloanDialogProps> = args => <WithdrawCrowdloanDialog {...args} />

Default.args = {
  open: true,
}
