import { ComponentMeta, Story } from '@storybook/react'

import AccountValueInfo, { AccountValueInfoProps } from './AccountValueInfo'

export default {
  title: 'Molecules/AccountValueInfo',
  component: AccountValueInfo,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof AccountValueInfo>

export const Default: Story<AccountValueInfoProps> = (args: any) => <AccountValueInfo {...args} />

Default.args = {
  address: '0x1234567890123456789012345678901234567890',
  name: 'My Account',
  balance: 320728.44,
}
