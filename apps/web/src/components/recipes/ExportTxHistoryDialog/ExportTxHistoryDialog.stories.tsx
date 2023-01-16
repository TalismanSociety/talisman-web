import { ComponentMeta, Story } from '@storybook/react'

import ExportTxHistoryDialog, { ExportTxHistoryDialogProps } from './ExportTxHistoryDialog'

export default {
  title: 'Recipes/ExportTxHistoryDialog',
  component: ExportTxHistoryDialog,
} as ComponentMeta<typeof ExportTxHistoryDialog>

export const Default: Story<ExportTxHistoryDialogProps> = args => <ExportTxHistoryDialog {...args} />

Default.args = {
  open: true,
}
