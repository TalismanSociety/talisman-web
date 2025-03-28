import { type ComponentMeta, type Story } from '@storybook/react'

import type { StatusIndicatorProps } from './StatusIndicator'
import { StatusIndicator } from './StatusIndicator'

export default {
  title: 'Atoms/StatusIndicator',
  component: StatusIndicator,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof StatusIndicator>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Template: Story<StatusIndicatorProps> = (args: any) => <StatusIndicator {...args} />

export const Success = Template.bind({})

Success.args = {
  status: 'success',
  tooltip: 'Success',
}

export const Warning = Template.bind({})

Warning.args = {
  status: 'warning',
  tooltip: 'Warning',
}

export const Error = Template.bind({})

Error.args = {
  status: 'error',
  tooltip: 'Error',
}

export const Undefined = Template.bind({})

Undefined.args = {
  status: undefined,
  tooltip: 'Error',
}
