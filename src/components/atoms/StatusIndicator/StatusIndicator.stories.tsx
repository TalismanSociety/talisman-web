import { ComponentMeta, Story } from '@storybook/react'

import StatusIndicator, { StatusIndicatorProps } from './StatusIndicator'

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
}

export const Warning = Template.bind({})

Warning.args = {
  status: 'warning',
}

export const Error = Template.bind({})

Error.args = {
  status: 'error',
}
