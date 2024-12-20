import { type ComponentMeta, type Story } from '@storybook/react'

import type { SegmentedButtonProps } from './SegmentedButton'
import { SegmentedButton } from './SegmentedButton'

export default {
  title: 'Molecules/SegmentedButton',
  component: SegmentedButton,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof SegmentedButton>

export const Default: Story<SegmentedButtonProps<string>> = args => <SegmentedButton {...args} />

Default.args = {
  value: 'collections',
  children: (
    <>
      <SegmentedButton.ButtonSegment value="collections">Collections</SegmentedButton.ButtonSegment>
      <SegmentedButton.ButtonSegment value="items">Items</SegmentedButton.ButtonSegment>
    </>
  ),
}

Default.argTypes = {
  value: { options: ['collections', 'items'], control: { type: 'radio' } },
}
