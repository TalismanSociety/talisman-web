import { type ComponentMeta, type Story } from '@storybook/react'

import CircularProgressIndicator, { type CircularProgressIndicatorProps } from './CircularProgressIndicator'

export default {
  title: 'Atoms/CircularProgressIndicator',
  component: CircularProgressIndicator,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof CircularProgressIndicator>

const Template: Story<CircularProgressIndicatorProps> = (args: any) => <CircularProgressIndicator {...args} />

export const Default = Template.bind({})

Default.args = {}
