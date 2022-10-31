import { ComponentMeta, Story } from '@storybook/react'

import Text, { TextProps } from './Text'

export default {
  title: 'Atoms/Text',
  component: Text,
} as ComponentMeta<typeof Text>

export const Default: Story<TextProps<'span'>> = (args: any) => (
  <div>
    <Text.H1 {...args} />
    <Text.H2 {...args} />
    <Text.H3 {...args} />
    <Text.H4 {...args} />
    <Text {...args} />
  </div>
)

Default.args = {
  children: 'The quick brown fox jumps over the lazy dog',
}
