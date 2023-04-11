import { type ComponentMeta, type Story } from '@storybook/react'

import StatusIndicator, { type StatusIndicatorProps } from './StatusIndicator'

export default {
  title: 'Atoms/StatusIndicator',
  component: StatusIndicator,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof StatusIndicator>

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
