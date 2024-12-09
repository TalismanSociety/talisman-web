import { type ComponentMeta, type Story } from '@storybook/react'

import type { StakeDialogProps } from './StakeDialog'
import { Default as StakeFormStory } from '../StakeForm/StakeForm.stories'
import StakeDialog from './StakeDialog'

export default {
  title: 'Recipes/StakeDialog',
  component: StakeDialog,
} as ComponentMeta<typeof StakeDialog>

export const Default: Story<StakeDialogProps> = args => <StakeDialog {...args} />

Default.args = {
  open: true,
  stats: (
    <StakeDialog.Stats>
      <StakeDialog.Stats.Item overlineContent="Rewards" headlineContent="15.07% APR" />
      <StakeDialog.Stats.Item overlineContent="Current era ends" headlineContent="9h 24min" />
    </StakeDialog.Stats>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stakeInput: <StakeFormStory {...(StakeFormStory.args as any)} />,
  learnMoreAnchor: <StakeDialog.LearnMore />,
}
