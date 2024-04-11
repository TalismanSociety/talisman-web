import { type ComponentMeta, type Story } from '@storybook/react'

import PoolUnstake, { PoolUnstakeList, type PoolUnstakeProps } from './PoolUnstake'

export default {
  title: 'Recipes/PoolUnstake',
  component: PoolUnstake,
} as ComponentMeta<typeof PoolUnstake>

export const Default: Story<PoolUnstakeProps> = args => (
  <PoolUnstakeList>
    <PoolUnstake {...args} />
    <PoolUnstake {...args} />
    <PoolUnstake {...args} />
  </PoolUnstakeList>
)

Default.args = {
  accountName: 'Yeet account',
  accountAddress: '143wN4e1nTTWJZHy1CFVXDHpAg6YJsNn2jDN52J2Xfjf8MWs',
  unstakingAmount: '22 DOT',
  unstakingFiatAmount: '$6,475.56',
  timeTilWithdrawable: '24d 8hr 11min',
}

export const Withdrawable = Default.bind({})

Withdrawable.args = {
  accountName: 'Yeet account',
  accountAddress: '143wN4e1nTTWJZHy1CFVXDHpAg6YJsNn2jDN52J2Xfjf8MWs',
  unstakingAmount: '22 DOT',
  unstakingFiatAmount: '$6,475.56',
}
