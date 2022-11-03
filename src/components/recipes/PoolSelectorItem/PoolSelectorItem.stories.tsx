import { ComponentMeta, Story } from '@storybook/react'

import PoolSelectorItem, { PoolSelectorItemProps } from './PoolSelectorItem'

export default {
  title: 'Recipes/PoolSelectorItem',
  component: PoolSelectorItem,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof PoolSelectorItem>

export const Selected: Story<PoolSelectorItemProps> = args => (
  <div css={{ maxWidth: '20rem' }}>
    <PoolSelectorItem {...args} />
  </div>
)

Selected.args = {
  selected: true,
  poolName: 'Talisman Paraverse Pool',
  stakedAmount: '33.107 DOT Staked',
  talismanRecommended: true,
  rating: 1,
  memberCount: 69,
}

export const UnSelected: Story<PoolSelectorItemProps> = args => (
  <div css={{ maxWidth: '20rem' }}>
    <PoolSelectorItem {...args} />
  </div>
)

UnSelected.args = {
  selected: false,
  poolName: 'Talisman Paraverse Pool',
  stakedAmount: '33.107 DOT Staked',
  talismanRecommended: true,
  rating: 1,
  memberCount: 69,
}

export const Highlighted: Story<PoolSelectorItemProps> = args => (
  <div css={{ maxWidth: '20rem' }}>
    <PoolSelectorItem {...args} />
  </div>
)

Highlighted.args = {
  highlighted: true,
  poolName: 'Talisman Paraverse Pool',
  stakedAmount: '33.107 DOT Staked',
  talismanRecommended: true,
  rating: 1,
  memberCount: 69,
}
