import { ComponentMeta, Story } from '@storybook/react'

import BottomBorderNav, { BottomBorderNavProps } from './BottomBorderNav'

export default {
  title: 'Molecules/BottomBorderNav',
  component: BottomBorderNav,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof BottomBorderNav>

export const Default: Story<BottomBorderNavProps> = (args: any) => <BottomBorderNav {...args} />

Default.args = {
  items: [
    { label: 'Overview', url: '/portfolio' },
    { label: 'NFTs', url: '/nfts' },
    { label: 'History', url: '/history' },
  ],
}
