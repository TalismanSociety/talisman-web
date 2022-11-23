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
    { labelValue: 'Overview', path: '/portfolio' },
    { labelValue: 'NFTs', path: '/nfts' },
    { labelValue: 'History', path: '/history' },
  ],
}
