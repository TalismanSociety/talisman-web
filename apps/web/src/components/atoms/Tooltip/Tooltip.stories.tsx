import { ComponentMeta, Story } from '@storybook/react'

import Tooltip, { TooltipProps } from './Tooltip'

export default {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Tooltip>

export const Default: Story<TooltipProps> = args => <Tooltip {...args} />

Default.args = {
  content: 'BAM! Tooltip',
  children: props => <div {...props}>Hover over me</div>,
}
