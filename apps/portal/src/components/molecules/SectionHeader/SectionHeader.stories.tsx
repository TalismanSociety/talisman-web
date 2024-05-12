import SectionHeader, { type SectionHeaderProps } from './SectionHeader'
import { type ComponentMeta, type Story } from '@storybook/react'

export default {
  title: 'Molecules/SectionHeader',
  component: SectionHeader,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof SectionHeader>

export const Default: Story<SectionHeaderProps> = (args: any) => <SectionHeader {...args} />

Default.args = {
  headlineContent: 'Assets',
  supportingContent: '$19,495.23',
}
