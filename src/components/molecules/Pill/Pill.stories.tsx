import { ComponentMeta, Story } from '@storybook/react'

import Pill, { PillProps } from './Pill'

export default {
  title: 'Molecules/Pill',
  component: Pill,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Pill>

export const Default: Story<PillProps> = (args: any) => <Pill {...args} />

Default.args = {
  headerText: 'Head',
  text: 'Glorious Knight Helm',
}
