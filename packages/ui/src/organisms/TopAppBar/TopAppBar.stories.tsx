import { type ComponentMeta, type Story } from '@storybook/react'
import { MoreHorizontal, TalismanHand } from '@talismn/icons'

import { IconButton, Identicon } from '../../atoms'
import TopAppBar, { TopAppBarItem, type TopAppBarProps } from './TopAppBar'

export default {
  title: 'Organisms/TopAppBar',
  component: TopAppBar,
  subcomponents: {
    TopAppBarItem,
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div css={{ position: 'fixed', top: 0, right: 0, left: 0 }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof TopAppBar>

export const Default: Story<TopAppBarProps> = args => <TopAppBar {...args} />

Default.args = {
  navigationIcon: (
    <IconButton>
      <TalismanHand />
    </IconButton>
  ),
  actions: (
    <TopAppBar.Actions>
      <Identicon value="1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS" size="2.4rem" />
      <IconButton>
        <MoreHorizontal />
      </IconButton>
    </TopAppBar.Actions>
  ),
}
