import { ComponentMeta, Story } from '@storybook/react'

import TeleportForm, { TeleportFormProps } from './TeleportForm'
import { Select } from '@talismn/ui'

export default {
  title: 'Recipes/TeleportForm',
  component: TeleportForm,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof TeleportForm>

export const Default: Story<TeleportFormProps> = args => <TeleportForm {...args} />

Default.args = {
  accountSelector: (
    <Select width="100%" placeholder="Select account">
      <Select.Item headlineText="foo" />
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

export const Skeleton = () => <TeleportForm.Skeleton />
