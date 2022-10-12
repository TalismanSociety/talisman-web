import { ComponentMeta, Story } from '@storybook/react'

import PoolSelectorItem, { PoolSelectorItemProps } from './PoolSelectorItem'

export default {
  title: 'Recipes/PoolSelectorItem',
  component: PoolSelectorItem,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof PoolSelectorItem>

export const Default: Story<PoolSelectorItemProps> = args => <PoolSelectorItem {...args} />

Default.args = {
  selected: true,
  poolName: 'Talisman Paraverse Pool',
  stakedAmount: '33.107 DOT Staked',
  talismanRecommended: true,
  rating: 1,
  memberCount: 69,
}
