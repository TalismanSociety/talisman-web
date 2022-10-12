import { ComponentMeta } from '@storybook/react'

import TextInput, { LabelButton } from './TextInput'

export default {
  title: 'Molecules/TextInput',
  component: TextInput,
  subcomponents: {
    LabelButton,
  },
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    leadingLabel: {
      type: 'string',
      defaultValue: 'Available to stake',
    },
    trailingLabel: {
      type: 'string',
      defaultValue: '420 DOT',
    },
    placeholder: {
      type: 'string',
      defaultValue: '0 DOT',
    },
    trailingIcon: {
      defaultValue: <LabelButton>MAX</LabelButton>,
    },
    leadingSupportingText: {
      type: 'string',
      defaultValue: '$99,999.99',
    },
    trailingSupportingText: {
      type: 'string',
      defaultValue: 'Good to go',
    },
  },
} as ComponentMeta<typeof TextInput>

export const Default = (args: any) => <TextInput {...args} />
