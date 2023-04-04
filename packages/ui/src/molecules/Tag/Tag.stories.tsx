import { type ComponentMeta, type Story } from '@storybook/react'

import Tag, { type TagProps } from './Tag'

export default {
  title: 'Molecules/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Tag>

export const Default: Story<TagProps> = (args: any) => <Tag {...args} />

Default.args = {
  header: 'Head',
  content: 'Glorious Knight Helm',
}
