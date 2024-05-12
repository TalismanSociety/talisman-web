import FloatingActionButton, { type FloatingActionButtonProps } from './FloatingActionButton'
import { type ComponentMeta, type Story } from '@storybook/react'
import { Union } from '@talismn/web-icons'

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
