import { ComponentMeta } from '@storybook/react'

import PoolSelectorItem from './PoolSelectorItem'

export default {
  title: 'Recipes/PoolSelectorItem',
  component: PoolSelectorItem,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    selected: { defaultValue: true },
    poolName: { defaultValue: 'Talisman Paraverse Pool' },
    stakedAmount: { defaultValue: '33.107 DOT Staked' },
    talismanRecommended: { defaultValue: true },
    rating: { defaultValue: 1 },
    memberCount: { defaultValue: 69 },
  },
} as ComponentMeta<typeof PoolSelectorItem>

export const Default = (args: any) => <PoolSelectorItem {...args} />
