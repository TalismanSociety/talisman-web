import { type ComponentMeta, type Story } from '@storybook/react'

import type { AnimatedNumberProps } from './AnimatedNumber'
import { AnimatedNumber } from './AnimatedNumber'

export default {
  title: 'Atoms/AnimatedNumber',
  component: AnimatedNumber,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof AnimatedNumber>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Default: Story<AnimatedNumberProps> = (args: any) => <AnimatedNumber {...args} />

Default.args = {
  end: 320728.44,
}
