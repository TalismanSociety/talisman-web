import { ComponentMeta, Story } from '@storybook/react'

import PoolSelectorItem from '../PoolSelectorItem/PoolSelectorItem'
import { Default as PoolSelectorItemDefault } from '../PoolSelectorItem/PoolSelectorItem.stories'
import PoolSelector, { PoolSelectorProps } from './PoolSelector'

export default {
  title: 'Recipes/PoolSelector',
  component: PoolSelector,
  subcomponents: { PoolSelectorItem },
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof PoolSelector>

export const Default: Story<PoolSelectorProps> = (args: any) => <PoolSelector {...args} />

Default.args = {
  children: [
    <PoolSelectorItemDefault {...(PoolSelectorItemDefault.args as any)} selected />,
    <PoolSelectorItemDefault {...(PoolSelectorItemDefault.args as any)} selected={false} />,
    <PoolSelectorItemDefault {...(PoolSelectorItemDefault.args as any)} selected={false} />,
    <PoolSelectorItemDefault {...(PoolSelectorItemDefault.args as any)} selected={false} />,
  ],
}
