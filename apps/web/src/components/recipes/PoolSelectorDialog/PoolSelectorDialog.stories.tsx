import { type ComponentMeta, type Story } from '@storybook/react'

import PoolSelectorItem from '../PoolSelectorItem/PoolSelectorItem'
import {
  Selected as SelectedPoolSelectorItem,
  UnSelected as UnSelectedPoolSelectorItem,
} from '../PoolSelectorItem/PoolSelectorItem.stories'
import PoolSelectorDialog, { type PoolSelectorDialogProps } from './PoolSelectorDialog'

export default {
  title: 'Recipes/PoolSelectorDialog',
  component: PoolSelectorDialog,
  subcomponents: { PoolSelectorItem },
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof PoolSelectorDialog>

export const Default: Story<PoolSelectorDialogProps> = (args: any) => <PoolSelectorDialog {...args} />

Default.args = {
  open: true,
  children: [
    <SelectedPoolSelectorItem key={0} {...(SelectedPoolSelectorItem.args as any)} selected />,
    ...new Array(50)
      .fill(undefined)
      .map((_, index) => (
        <UnSelectedPoolSelectorItem
          key={index + 1}
          {...(UnSelectedPoolSelectorItem.args as any)}
          memberCount={index + 1}
        />
      )),
  ],
}

export const FewItems = Default.bind({})

FewItems.args = {
  ...Default.args,
  children: [
    <SelectedPoolSelectorItem key={0} {...(SelectedPoolSelectorItem.args as any)} />,
    <UnSelectedPoolSelectorItem key={1} {...(UnSelectedPoolSelectorItem.args as any)} />,
    <UnSelectedPoolSelectorItem key={2} {...(UnSelectedPoolSelectorItem.args as any)} />,
    <UnSelectedPoolSelectorItem key={3} {...(UnSelectedPoolSelectorItem.args as any)} />,
  ],
}
