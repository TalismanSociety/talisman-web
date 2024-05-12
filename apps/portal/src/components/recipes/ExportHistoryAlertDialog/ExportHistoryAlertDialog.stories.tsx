import ExportHistoryAlertDialog from './ExportHistoryAlertDialog'
import { type Meta, type StoryObj } from '@storybook/react'

export default {
  title: 'Recipes/ExportHistoryAlertDialog',
  component: ExportHistoryAlertDialog,
} satisfies Meta<typeof ExportHistoryAlertDialog>

type Story = StoryObj<typeof ExportHistoryAlertDialog>

export const Default: Story = {
  args: { recordCount: 7 },
}
