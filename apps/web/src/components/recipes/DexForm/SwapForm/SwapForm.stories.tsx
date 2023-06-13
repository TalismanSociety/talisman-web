import { type Meta, type Story } from '@storybook/react'

import { Select } from '@talismn/ui'
import SwapForm, { type SwapFormProps } from './SwapForm'

export default {
  title: 'Recipes/DexForm/SwapForm',
  component: SwapForm,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SwapForm>

export const Default: Story<SwapFormProps> = args => <SwapForm {...args} />

Default.args = {
  accountSelector: (
    <Select css={{ width: '100%' }} placeholder="Select account">
      <Select.Option headlineText="foo" />
    </Select>
  ),
}
