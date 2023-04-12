import { ComponentMeta, Story } from '@storybook/react'

import { Default as TransferFormStory } from '../TransferForm/TransferForm.stories'
import TransferDialog, { TransferDialogProps } from './TransferDialog'

export default {
  title: 'Recipes/TransferDialog',
  component: TransferDialog,
} as ComponentMeta<typeof TransferDialog>

export const Default: Story<TransferDialogProps> = args => <TransferDialog {...args} />

Default.args = {
  open: true,
  transferForm: <TransferFormStory {...(TransferFormStory.args as any)} />,
}
