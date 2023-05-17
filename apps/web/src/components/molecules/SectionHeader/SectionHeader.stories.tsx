import { type ComponentMeta, type Story } from '@storybook/react'

import SectionHeader, { type SectionHeaderProps } from './SectionHeader'

export default {
  title: 'Molecules/SectionHeader',
  component: SectionHeader,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof SectionHeader>

export const Default: Story<SectionHeaderProps> = (args: any) => <SectionHeader {...args} />

Default.args = {
  headlineText: 'Assets',
  supportingText: '$19,495.23',
}
