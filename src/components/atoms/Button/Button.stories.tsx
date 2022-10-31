import { ComponentMeta, Story } from '@storybook/react'

import Button, { ButtonProps } from './Button'

export default {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Button>

export const Default: Story<ButtonProps<'button'>> = args => <Button {...args} />

Default.args = {
  children: 'Click me',
}

export const Outlined = Default.bind({})

Outlined.args = {
  variant: 'outlined',
  children: 'Click me',
}
