import { type ComponentMeta, type Story } from '@storybook/react'

import InfoCard, { type InfoCardProps } from './InfoCard'

export default {
  title: 'Molecules/InfoCard',
  component: InfoCard,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof InfoCard>

export const Default: Story<InfoCardProps> = (args: any) => <InfoCard {...args} />

Default.args = {
  overlineContent: 'Available to Stake',
  headlineContent: '1450.22 DOT',
  supportingContent: '$9,030.00',
}
