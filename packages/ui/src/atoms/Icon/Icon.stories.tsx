import { type ComponentMeta, type Story } from '@storybook/react'
import { TalismanHand } from '@talismn/icons'

import Icon, { type IconProps } from './Icon'

export default {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Icon>

export const Default: Story<IconProps<'button'>> = args => <Icon {...args} />

Default.args = {
  children: <TalismanHand />,
}
