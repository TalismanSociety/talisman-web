import { type ComponentMeta, type Story } from '@storybook/react'

import Tooltip, { type TooltipProps } from './Tooltip'

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
  children: <div>Hover over me</div>,
}
