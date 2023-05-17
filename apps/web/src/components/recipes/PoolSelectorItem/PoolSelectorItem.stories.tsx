import { type ComponentMeta, type Story } from '@storybook/react'

import PoolSelectorItem, { type PoolSelectorItemProps } from './PoolSelectorItem'

export default {
  title: 'Recipes/PoolSelectorItem',
  component: PoolSelectorItem,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div css={{ maxWidth: '20rem' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof PoolSelectorItem>

export const Selected: Story<PoolSelectorItemProps> = args => <PoolSelectorItem {...args} />

Selected.args = {
  selected: true,
  poolName: 'Talisman Paraverse Pool',
  stakedAmount: '33.107 DOT Staked',
  talismanRecommended: true,
  rating: 1,
  memberCount: 69,
}

export const UnSelected: Story<PoolSelectorItemProps> = args => <PoolSelectorItem {...args} />

UnSelected.args = {
  selected: false,
  poolName: 'Talisman Paraverse Pool',
  stakedAmount: '33.107 DOT Staked',
  talismanRecommended: true,
  rating: 1,
  memberCount: 69,
}

export const Highlighted: Story<PoolSelectorItemProps> = args => <PoolSelectorItem {...args} />

Highlighted.args = {
  highlighted: true,
  poolName: 'Talisman Paraverse Pool',
  stakedAmount: '33.107 DOT Staked',
  talismanRecommended: true,
  rating: 1,
  memberCount: 69,
}
