import { ComponentMeta, Story } from '@storybook/react'

import PoolSelectorItem from '../PoolSelectorItem/PoolSelectorItem'
import { Default as PoolSelectorItemDefault } from '../PoolSelectorItem/PoolSelectorItem.stories'
import PoolSelectorDialog, { PoolSelectorDialogProps } from './PoolSelectorDialog'

export default {
  title: 'Recipes/PoolSelector',
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
    <PoolSelectorItemDefault {...(PoolSelectorItemDefault.args as any)} selected />,
    <PoolSelectorItemDefault {...(PoolSelectorItemDefault.args as any)} selected={false} />,
    <PoolSelectorItemDefault {...(PoolSelectorItemDefault.args as any)} selected={false} />,
    <PoolSelectorItemDefault {...(PoolSelectorItemDefault.args as any)} selected={false} />,
  ],
}
