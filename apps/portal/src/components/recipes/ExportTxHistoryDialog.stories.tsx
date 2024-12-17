import { type ComponentMeta, type Story } from '@storybook/react'

import type { ExportTxHistoryDialogProps } from './ExportTxHistoryDialog'
import { ExportTxHistoryDialog } from './ExportTxHistoryDialog'

export default {
  title: 'Recipes/ExportTxHistoryDialog',
  component: ExportTxHistoryDialog,
} as ComponentMeta<typeof ExportTxHistoryDialog>

export const Default: Story<ExportTxHistoryDialogProps> = args => <ExportTxHistoryDialog {...args} />

Default.args = {
  open: true,
}
