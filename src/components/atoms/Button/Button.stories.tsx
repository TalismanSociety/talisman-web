import { ComponentMeta } from '@storybook/react'

import Button from './Button'

export default {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      name: 'label',
      type: 'string',
      control: 'text',
      defaultValue: 'Click me',
    },
  },
} as ComponentMeta<typeof Button>

export const Default = (args: any) => <Button {...args} />

export const Outlined = (args: any) => <Button {...args} variant="outlined" />
