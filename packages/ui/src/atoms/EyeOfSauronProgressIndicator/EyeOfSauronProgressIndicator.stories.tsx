import { type ComponentMeta, type Story } from '@storybook/react'

import EyeOfSauronProgressIndicator, { type EyeOfSauronProgressIndicatorProps } from './EyeOfSauronProgressIndicator'

export default {
  title: 'Atoms/EyeOfSauronProgressIndicator',
  component: EyeOfSauronProgressIndicator,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof EyeOfSauronProgressIndicator>

export const Default: Story<EyeOfSauronProgressIndicatorProps> = args => <EyeOfSauronProgressIndicator {...args} />

Default.args = {
  state: 'pending',
}
