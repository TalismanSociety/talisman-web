import { type ComponentMeta, type Story } from '@storybook/react'
import { Union } from '@talismn/icons'

import Chip, { type ChipProps } from './Chip'

export default {
  title: 'Atoms/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Chip>

export const Default: Story<ChipProps> = args => <Chip {...args} />

Default.args = {
  children: 'Talisman',
}

export const Assist = Default.bind({})

Assist.args = {
  leadingContent: <Union />,
  children: 'Talisman',
}
