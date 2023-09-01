import { ComponentMeta, Story, type, type } from '@storybook/react'
import { Select } from '@talismn/ui'

import TransportForm, { TransportFormProps, type } from './TransportForm'

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
