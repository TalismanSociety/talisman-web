import { ComponentMeta, Story } from '@storybook/react'

import { Default as TeleportFormStory } from '../TeleportForm/TeleportForm.stories'
import TeleportDialog, { TeleportDialogProps } from './TeleportDialog'

export default {
  title: 'Recipes/TeleportDialog',
  component: TeleportDialog,
} as ComponentMeta<typeof TeleportDialog>

export const Default: Story<TeleportDialogProps> = args => <TeleportDialog {...args} />

Default.args = {
  open: true,
  teleportForm: <TeleportFormStory {...(TeleportFormStory.args as any)} />,
}
