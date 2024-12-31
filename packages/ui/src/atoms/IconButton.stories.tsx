import { type ComponentMeta, type Story } from '@storybook/react'
import { Zap } from '@talismn/web-icons'

import type { IconButtonProps } from './IconButton'
import { IconButton } from './IconButton'

export default {
  title: 'Atoms/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof IconButton>

export const Default: Story<IconButtonProps<'button'>> = (args: IconButtonProps) => <IconButton {...args} />

Default.args = {
  children: <Zap />,
}
