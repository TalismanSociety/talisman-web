import { IconButton } from '../..'
import ContainedTextInput, { type ContainedTextInputProps } from './ContainedTextInput'
import { type Meta, type Story } from '@storybook/react'
import { Search } from '@talismn/web-icons'

export default {
  title: 'Molecules/ContainedTextInput',
  component: ContainedTextInput,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ContainedTextInput>

export const Default: Story<ContainedTextInputProps> = args => <ContainedTextInput {...args} />

Default.args = {
  type: 'text',
  leadingLabel: 'Available to stake',
  trailingLabel: '420 DOT',
  leadingIcon: (
    <IconButton>
      <Search />
    </IconButton>
  ),
  placeholder: '0.00',
  leadingSupportingText: '$99,999.99',
  trailingSupportingText: 'Good to go',
}
