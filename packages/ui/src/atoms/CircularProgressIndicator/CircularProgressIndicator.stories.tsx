import CircularProgressIndicator, { type CircularProgressIndicatorProps } from './CircularProgressIndicator'
import { type ComponentMeta, type Story } from '@storybook/react'

export default {
  title: 'Atoms/CircularProgressIndicator',
  component: CircularProgressIndicator,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof CircularProgressIndicator>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Template: Story<CircularProgressIndicatorProps> = (args: any) => <CircularProgressIndicator {...args} />

export const Default = Template.bind({})

Default.args = {}
