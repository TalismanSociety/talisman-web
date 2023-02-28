import { ComponentMeta, Story } from '@storybook/react'

import DateInput, { DateInputProps } from './DateInput'

export default {
  title: 'Molecules/DateInput',
  component: DateInput,
} as ComponentMeta<typeof DateInput>

export const Default: Story<DateInputProps> = args => <DateInput {...args} />

Default.args = {}
