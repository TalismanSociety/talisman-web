import { ComponentMeta, Story } from '@storybook/react'

import TransferForm, { TransferFormProps } from './TransferForm'
import { Select } from '@talismn/ui'

export default {
  title: 'Recipes/TransferForm',
  component: TransferForm,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof TransferForm>

export const Default: Story<TransferFormProps> = args => <TransferForm {...args} />

Default.args = {
  accountSelector: (
    <Select width="100%" placeholder="Select account">
      <Select.Item headlineText="foo" />
    </Select>
  ),
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
  selectedFromNetworkIndex: 0,
  selectedToNetworkIndex: 0,
  token: { name: 'DOT', logoSrc: '' },
}

export const Loading = Default.bind({})

Loading.args = {
  ...Default.args,
  loading: true,
}
