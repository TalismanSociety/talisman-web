import { type ComponentMeta, type Story } from '@storybook/react'

import type { InfoCardProps } from './InfoCard'
import { InfoCard } from './InfoCard'

export default {
  title: 'Molecules/InfoCard',
  component: InfoCard,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof InfoCard>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Default: Story<InfoCardProps> = (args: any) => <InfoCard {...args} />

Default.args = {
  overlineContent: 'Available to Stake',
  headlineContent: '1450.22 DOT',
  supportingContent: '$9,030.00',
}
