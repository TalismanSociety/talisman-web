import { ComponentMeta, Story } from '@storybook/react'
import { Union } from '@talismn/icons'

import FloatingActionButton, { FloatingActionButtonProps } from './FloatingActionButton'

export default {
  title: 'Atoms/FloatingActionButton',
  component: FloatingActionButton,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof FloatingActionButton>

export const Default: Story<FloatingActionButtonProps<'button'>> = args => <FloatingActionButton {...args} />

Default.args = {
  children: <Union />,
}
