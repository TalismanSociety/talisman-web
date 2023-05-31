import { type ComponentMeta, type Story } from '@storybook/react'

import { Default as TransportFormStory } from '../TransportForm/TransportForm.stories'
import TransportDialog, { type TransportDialogProps } from './TransportDialog'

export default {
  title: 'Recipes/TransportDialog',
  component: TransportDialog,
} as ComponentMeta<typeof TransportDialog>

export const Default: Story<TransportDialogProps> = args => <TransportDialog {...args} />

Default.args = {
  open: true,
  transportForm: <TransportFormStory {...(TransportFormStory.args as any)} />,
}
