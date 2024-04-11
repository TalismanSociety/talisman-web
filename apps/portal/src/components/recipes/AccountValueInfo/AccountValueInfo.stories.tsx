import { type ComponentMeta, type Story } from '@storybook/react'

import AccountValueInfo, { type AccountValueInfoProps } from './AccountValueInfo'

export default {
  title: 'Recipes/AccountValueInfo',
  component: AccountValueInfo,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof AccountValueInfo>

export const Default: Story<AccountValueInfoProps> = (args: any) => <AccountValueInfo {...args} />

Default.args = {
  account: { address: '0x1234567890123456789012345678901234567890', name: 'My Account' },
  balance: 320728.44,
}
