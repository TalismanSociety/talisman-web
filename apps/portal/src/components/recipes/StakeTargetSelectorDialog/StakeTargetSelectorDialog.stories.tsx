import { type ComponentMeta, type Story } from '@storybook/react'

import StakeTargetSelectorItem from './StakeTargetSelectorItem/StakeTargetSelectorItem'
import {
  Selected as SelectedStakeTargetSelectorItem,
  UnSelected as UnSelectedStakeTargetSelectorItem,
} from './StakeTargetSelectorItem/StakeTargetSelectorItem.stories'
import StakeTargetSelectorDialog, { type StakeTargetSelectorDialogProps } from './StakeTargetSelectorDialog'

export default {
  title: 'Recipes/StakeTargetSelectorDialog',
  component: StakeTargetSelectorDialog,
  subcomponents: { StakeTargetSelectorItem },
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof StakeTargetSelectorDialog>

export const Default: Story<StakeTargetSelectorDialogProps> = (args: any) => <StakeTargetSelectorDialog {...args} />

Default.args = {
  open: true,
  children: [
    <SelectedStakeTargetSelectorItem key={0} {...(SelectedStakeTargetSelectorItem.args as any)} selected />,
    ...new Array(50)
      .fill(undefined)
      .map((_, index) => (
        <UnSelectedStakeTargetSelectorItem
          key={index + 1}
          {...(UnSelectedStakeTargetSelectorItem.args as any)}
          count={index + 1}
        />
      )),
  ],
}

export const FewItems = Default.bind({})

FewItems.args = {
  ...Default.args,
  children: [
    <SelectedStakeTargetSelectorItem key={0} {...(SelectedStakeTargetSelectorItem.args as any)} />,
    <UnSelectedStakeTargetSelectorItem key={1} {...(UnSelectedStakeTargetSelectorItem.args as any)} />,
    <UnSelectedStakeTargetSelectorItem key={2} {...(UnSelectedStakeTargetSelectorItem.args as any)} />,
    <UnSelectedStakeTargetSelectorItem key={3} {...(UnSelectedStakeTargetSelectorItem.args as any)} />,
  ],
}
