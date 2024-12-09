import { type ComponentMeta, type Story } from '@storybook/react'

import type { AccountValueInfoProps } from './AccountValueInfo'
import AccountValueInfo from './AccountValueInfo'

export default {
  title: 'Recipes/AccountValueInfo',
  component: AccountValueInfo,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof AccountValueInfo>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Default: Story<AccountValueInfoProps> = (args: any) => <AccountValueInfo {...args} />

Default.args = {
  account: { address: '0x1234567890123456789012345678901234567890', name: 'My Account' },
  balance: 320728.44,
}
