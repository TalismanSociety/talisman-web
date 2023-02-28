import { ComponentMeta, Story } from '@storybook/react'

import Icon from '../Icon'
import IconButton, { IconButtonProps } from './IconButton'

export default {
  title: 'Atoms/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof IconButton>

export const Default: Story<IconButtonProps<'button'>> = args => <IconButton {...args} />

Default.args = {
  children: <Icon.Union />,
}
