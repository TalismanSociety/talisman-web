import { type Meta, type StoryObj } from '@storybook/react'

import ExportHistoryAlertDialog from './ExportHistoryAlertDialog'

export default {
  title: 'Recipes/ExportHistoryAlertDialog',
  component: ExportHistoryAlertDialog,
} satisfies Meta<typeof ExportHistoryAlertDialog>

type Story = StoryObj<typeof ExportHistoryAlertDialog>

export const Default: Story = {
  args: { recordCount: 7 },
}
