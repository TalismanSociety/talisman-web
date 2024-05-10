import { type ComponentMeta, type Story } from '@storybook/react'
import { ChevronDown } from '@talismn/web-icons'
import { motion } from 'framer-motion'

import { Button, Identicon } from '../../atoms'
import Menu, { MENU_OFFSET, type MenuProps } from './Menu'

export default {
  title: 'Molecules/Menu',
  component: Menu,
} as ComponentMeta<typeof Menu>

export const Default: Story<MenuProps> = args => (
  <div>
    <div css={{ position: 'fixed', top: MENU_OFFSET, left: MENU_OFFSET }}>
      <Menu {...args} />
    </div>
    <div css={{ position: 'fixed', top: MENU_OFFSET, right: MENU_OFFSET }}>
      <Menu {...args} />
    </div>
    <div css={{ position: 'fixed', bottom: MENU_OFFSET, left: MENU_OFFSET }}>
      <Menu {...args} />
    </div>
    <div css={{ position: 'fixed', bottom: MENU_OFFSET, right: MENU_OFFSET }}>
      <Menu {...args} />
    </div>
  </div>
)

const AnimatedChevron = motion(ChevronDown)

Default.args = {
  children: [
    <Menu.Button key={0}>
      <Button trailingIcon={<AnimatedChevron variants={{ true: { transform: 'rotate(180deg)' }, false: {} }} />}>
        Toggle
      </Button>
    </Menu.Button>,
    <Menu.Items key={1}>
      <Menu.Item.Button
        headlineContent="Polkadot.js import"
        overlineContent="$356,120.32"
        leadingContent={<Identicon value="1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS" size="4rem" />}
      />
      <Menu.Item.Button
        headlineContent="Polkadot.js import"
        overlineContent="$356,120.32"
        leadingContent={<Identicon value="1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS" size="4rem" />}
      />
      <Menu.Item.Button
        headlineContent="Polkadot.js import"
        overlineContent="$356,120.32"
        leadingContent={<Identicon value="1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS" size="4rem" />}
      />
      <Menu.Item.Button
        headlineContent="Polkadot.js import"
        overlineContent="$356,120.32"
        leadingContent={<Identicon value="1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS" size="4rem" />}
      />
    </Menu.Items>,
  ],
}
