import { type ComponentMeta, type Story } from '@storybook/react'

import TextInput, { type TextInputProps } from './TextInput'

export default {
  title: 'Molecules/TextInput',
  component: TextInput,
  subcomponents: {
    ErrorLabel: TextInput.ErrorLabel,
    LabelButton: TextInput.LabelButton,
  },
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof TextInput>

export const Default: Story<TextInputProps> = args => <TextInput {...args} />

Default.args = {
  type: 'text',
  leadingLabel: 'Available to stake',
  trailingLabel: '420 DOT',
  placeholder: '0.00',
  trailingIcon: <TextInput.LabelButton>MAX</TextInput.LabelButton>,
  leadingSupportingText: '$99,999.99',
  trailingSupportingText: 'Good to go',
}
