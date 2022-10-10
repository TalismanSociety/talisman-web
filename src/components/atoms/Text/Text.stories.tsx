import { ComponentMeta } from '@storybook/react'

import Text from './Text'

export default {
  title: 'Atoms/Text',
  component: Text,
  argTypes: {
    children: {
      name: 'text',
      type: 'string',
      control: 'text',
      defaultValue: 'The quick brown fox jumps over the lazy dog',
    },
  },
} as ComponentMeta<typeof Text>

export const Texts = (args: any) => (
  <div>
    <Text.H1 {...args} />
    <Text.H2 {...args} />
    <Text.H3 {...args} />
    <Text.H4 {...args} />
    <Text {...args} />
  </div>
)
