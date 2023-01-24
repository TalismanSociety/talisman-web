import { ComponentMeta, Story } from '@storybook/react'

import Swap, { SwapProps } from './Swap'

export default {
  title: 'Recipes/Swap',
  component: Swap,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Swap>

export const Default: Story<SwapProps> = args => <Swap {...args} />

Default.args = {
  accounts: [
    { address: '143wN4e1nTTWJZHy1CFVXDHpAg6YJsNn2jDN52J2Xfjf8MWs', name: 'Yeet account', balance: '' },
    { address: '143wN4e1nTTWJZHy1CFVXDHpAg6YJsNn2jDN52J2Xfjf8MWs', name: 'Yeet account', balance: '' },
    { address: '143wN4e1nTTWJZHy1CFVXDHpAg6YJsNn2jDN52J2Xfjf8MWs', name: 'Yeet account', balance: '' },
  ],
  fromNetworks: [
    { name: 'Polkadot', logoSrc: '' },
    { name: 'Kusama', logoSrc: '' },
    { name: 'Westend', logoSrc: '' },
  ],
  toNetworks: [
    { name: 'Polkadot', logoSrc: '' },
    { name: 'Kusama', logoSrc: '' },
    { name: 'Westend', logoSrc: '' },
  ],
}

export const WithSelection = Default.bind({})

WithSelection.args = {
  ...Default.args,
  selectedAccountIndex: 0,
  selectedFromNetworkIndex: 0,
  selectedToNetworkIndex: 0,
  token: { name: 'DOT', logoSrc: '' },
}

export const Loading = Default.bind({})

Loading.args = {
  ...Default.args,
  loading: true,
}
