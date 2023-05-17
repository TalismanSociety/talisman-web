import { type ComponentMeta, type Story } from '@storybook/react'
import { Default as StakeFormStory } from '@components/recipes/StakeForm/StakeForm.stories'
import StakeDialog, { type StakeDialogProps } from './StakeDialog'

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
  stakeInput: <StakeFormStory {...(StakeFormStory.args as any)} />,
  learnMoreAnchor: <StakeDialog.LearnMore />,
}
