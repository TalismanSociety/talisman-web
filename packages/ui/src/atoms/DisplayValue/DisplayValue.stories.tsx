import { ComponentMeta, Story } from '@storybook/react'

import DisplayValue, { DisplayValueProps } from './DisplayValue'

export default {
  title: 'Atoms/DisplayValue',
  component: DisplayValue,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof DisplayValue>

export const Default: Story<DisplayValueProps> = (args: any) => <DisplayValue {...args} />

Default.args = {
  amount: 320728.44,
  noCountUp: false,
  currency: 'usd',
}
