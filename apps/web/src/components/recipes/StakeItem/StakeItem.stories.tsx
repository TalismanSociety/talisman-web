import { ComponentMeta, Story } from '@storybook/react'
import { Clock } from '@talismn/icons'

import StakeItem, { ClaimChip, IncreaseStakeChip, StakeItemProps, UnstakeChip } from './StakeItem'

export default {
  title: 'Recipes/StakeItem',
  component: StakeItem,
} as ComponentMeta<typeof StakeItem>

export const Default: Story<StakeItemProps> = args => <StakeItem {...args} />

Default.args = {
  actions: [<ClaimChip key="0" amount="104.96 DOT" />, <UnstakeChip key="1" />, <IncreaseStakeChip key="2" />],
  status: (
    <>
      <Clock size="1em" /> Unstaking 14d 8hr 11min
    </>
  ),
}
