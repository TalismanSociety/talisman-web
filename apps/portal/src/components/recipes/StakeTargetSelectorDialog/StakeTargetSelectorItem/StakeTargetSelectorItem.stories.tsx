import StakeTargetSelectorItem, { type StakeTargetSelectorItemProps } from './StakeTargetSelectorItem'
import { type ComponentMeta, type Story } from '@storybook/react'

export default {
  title: 'Recipes/StakeTargetSelectorDialog/Item',
  component: StakeTargetSelectorItem,
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
} as ComponentMeta<typeof StakeTargetSelectorItem>

export const Selected: Story<StakeTargetSelectorItemProps> = args => <StakeTargetSelectorItem {...args} />

Selected.args = {
  selected: true,
  name: 'Talisman Paraverse Pool',
  balance: '33.107 DOT Staked',
  talismanRecommended: true,
  rating: 1,
  count: 69,
}

export const UnSelected: Story<StakeTargetSelectorItemProps> = args => <StakeTargetSelectorItem {...args} />

UnSelected.args = {
  selected: false,
  name: 'Talisman Paraverse Pool',
  balance: '33.107 DOT Staked',
  talismanRecommended: true,
  rating: 1,
  count: 69,
}

export const Highlighted: Story<StakeTargetSelectorItemProps> = args => <StakeTargetSelectorItem {...args} />

Highlighted.args = {
  highlighted: true,
  name: 'Talisman Paraverse Pool',
  balance: '33.107 DOT Staked',
  talismanRecommended: true,
  rating: 1,
  count: 69,
}
