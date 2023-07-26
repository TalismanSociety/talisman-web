import { ComponentMeta, Story } from '@storybook/react'

import StakingInput from '../StakingInput'
import { Default as StakeInputStory } from '../StakingInput/StakingInput.stories'
import StakeDialog, { StakeDialogProps } from './StakeDialog'

export default {
  title: 'Recipes/StakeDialog',
  component: StakeDialog,
} as ComponentMeta<typeof StakeDialog>

export const Default: Story<StakeDialogProps> = args => <StakeDialog {...args} />

Default.args = {
  open: true,
  stats: (
    <StakeDialog.Stats>
      <StakeDialog.Stats.Item headlineText="Rewards" text="15.07% APR" />
      <StakeDialog.Stats.Item headlineText="Current era ends" text="9h 24min" />
    </StakeDialog.Stats>
  ),
  stakeInput: <StakingInput {...(StakeInputStory.args as any)} />,
  learnMoreAnchor: <StakeDialog.LearnMore />,
}
