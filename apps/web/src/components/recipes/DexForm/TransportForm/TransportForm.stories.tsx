import { type ComponentMeta, type Story } from '@storybook/react'

import TransportForm, { type TransportFormProps } from './TransportForm'
import { Select } from '@talismn/ui'

export default {
  title: 'Recipes/DexForm/TransportForm',
  component: TransportForm,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof TransportForm>

export const Default: Story<TransportFormProps> = args => <TransportForm {...args} />

Default.args = {
  accountSelector: (
    <Select css={{ width: '100%' }} placeholder="Select account">
      <Select.Option headlineText="foo" />
    </Select>
  ),
  fromChains: [
    { name: 'Polkadot', logoSrc: '' },
    { name: 'Kusama', logoSrc: '' },
    { name: 'Westend', logoSrc: '' },
  ],
  toChains: [
    { name: 'Polkadot', logoSrc: '' },
    { name: 'Kusama', logoSrc: '' },
    { name: 'Westend', logoSrc: '' },
  ],
  originFee: '1 DOT',
  destinationFee: '1 KSM',
}
