import { type ComponentMeta, type Story } from '@storybook/react'

import Button, { type ButtonProps } from './Button'
import { Save } from '@talismn/icons'

export default {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div css={{ width: 300, marginBottom: '1.6rem' }}>
          <Story />
        </div>
        <div css={{ width: 'fit-content' }}>
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    css: { width: '100%' },
  },
} as ComponentMeta<typeof Button>

export const Default: Story<ButtonProps<'button'>> = args => <Button {...args} />

Default.args = {
  children: 'Click me',
}

export const Secondary = Default.bind({})

Secondary.args = {
  variant: 'secondary',
  children: 'Click me',
}

export const Outlined = Default.bind({})

Outlined.args = {
  variant: 'outlined',
  children: 'Click me',
}

export const TrailingIcon = Default.bind({})

TrailingIcon.args = {
  children: 'Click me',
  trailingIcon: <Save />,
}

export const LeadingIcon = Default.bind({})

LeadingIcon.args = {
  children: 'Click me',
  leadingIcon: <Save />,
}

export const LeadingAndTrailingIcon = Default.bind({})

LeadingAndTrailingIcon.args = {
  children: 'Click me',
  leadingIcon: <Save />,
  trailingIcon: <Save />,
}
