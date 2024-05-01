import type { Meta, StoryObj } from '@storybook/react'
import ActivityLineItem, { ActivityList } from './Activities'

export default {
  component: ActivityLineItem,
} satisfies Meta<typeof ActivityLineItem>

type Story = StoryObj<typeof ActivityLineItem>

export const Default: Story = {
  args: {
    state: 'pending',
    amount: '500 DOT',
    date: new Date(),
    externalLink: globalThis.location.href,
  },
  render: props => (
    <ActivityList placeholder={null}>
      <ActivityList.Item {...props} />
      <ActivityList.Item {...props} />
      <ActivityList.Item {...props} />
    </ActivityList>
  ),
}
