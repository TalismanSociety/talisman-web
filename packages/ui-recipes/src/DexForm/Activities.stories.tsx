import ActivityLineItem, { ActivityList } from './Activities'
import type { Meta, StoryObj } from '@storybook/react'

export default {
  component: ActivityLineItem,
} satisfies Meta<typeof ActivityLineItem>

type Story = StoryObj<typeof ActivityLineItem>

export const Default: Story = {
  args: {
    state: 'pending',
    srcAmount: '500 DOT',
    destAmount: '1 ETH',
    srcAssetIconSrc: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/unknown.svg',
    destAssetIconSrc: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/unknown.svg',
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
