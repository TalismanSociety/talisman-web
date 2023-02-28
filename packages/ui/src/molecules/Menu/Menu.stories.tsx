import { ComponentMeta, Story } from '@storybook/react'
import { motion } from 'framer-motion'

import { Button, Icon, IconButton, Identicon, Text } from '../../atoms'
import ListItem from '../ListItem'
import Menu, { MenuProps, OFFSET } from './Menu'

export default {
  title: 'Molecules/Menu',
  component: Menu,
} as ComponentMeta<typeof Menu>

export const Default: Story<MenuProps> = args => (
  <div>
    <div css={{ position: 'fixed', top: OFFSET, left: OFFSET }}>
      <Menu {...args} />
    </div>
    <div css={{ position: 'fixed', top: OFFSET, right: OFFSET }}>
      <Menu {...args} />
    </div>
    <div css={{ position: 'fixed', bottom: OFFSET, left: OFFSET }}>
      <Menu {...args} />
    </div>
    <div css={{ position: 'fixed', bottom: OFFSET, right: OFFSET }}>
      <Menu {...args} />
    </div>
  </div>
)

const AnimatedChevron = motion(Icon.ChevronDown)

Default.args = {
  children: [
    <Menu.Button>
      <Button trailingIcon={<AnimatedChevron variants={{ true: { transform: 'rotate(180deg)' }, false: {} }} />}>
        Toggle
      </Button>
    </Menu.Button>,
    <Menu.Items>
      <Menu.Item>
        <ListItem
          headlineText="Polkadot.js import"
          overlineText="$356,120.32"
          leadingContent={<Identicon value="1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS" size="4rem" />}
        />
      </Menu.Item>
      <Menu.Item>
        <ListItem
          headlineText="Polkadot.js import"
          overlineText="$356,120.32"
          leadingContent={<Identicon value="1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS" size="4rem" />}
        />
      </Menu.Item>
      <Menu.Item>
        <ListItem
          headlineText="Polkadot.js import"
          overlineText="$356,120.32"
          leadingContent={<Identicon value="1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS" size="4rem" />}
        />
      </Menu.Item>
      <Menu.Item>
        <ListItem
          headlineText="Polkadot.js import"
          overlineText="$356,120.32"
          leadingContent={<Identicon value="1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS" size="4rem" />}
        />
      </Menu.Item>
    </Menu.Items>,
  ],
}
