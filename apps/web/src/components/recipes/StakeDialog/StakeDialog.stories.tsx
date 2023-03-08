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
  stakeInput: <StakingInput {...(StakeInputStory.args as any)} />,
  learnMoreAnchor: <StakeDialog.LearnMore />,
}
