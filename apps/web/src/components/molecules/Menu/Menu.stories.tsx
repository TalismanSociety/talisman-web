import Button from '@components/atoms/Button'
import { ChevronDown, Eye, Plus, Trash2, Union } from '@components/atoms/Icon'
import IconButton from '@components/atoms/IconButton'
import Identicon from '@components/atoms/Identicon'
import Text from '@components/atoms/Text'
import { ComponentMeta, Story } from '@storybook/react'
import { motion } from 'framer-motion'

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

const AnimatedChevron = motion(ChevronDown)

Default.args = {
  children: [
    <Menu.Button>
      <Button
        trailingIcon={<AnimatedChevron variants={{ true: { transform: 'rotate(180deg)' }, false: {} }} />}
        css={{ width: '20vw' }}
      >
        Toggle
      </Button>
    </Menu.Button>,
    <Menu.Items>
      <section css={{ width: '32rem' }}>
        <Text.Body as="header" alpha="high" css={{ marginBottom: '1.6rem' }}>
          Select account
        </Text.Body>
        <section css={{ marginBottom: '1.6rem' }}>
          <Text.Body as="header" css={{ fontWeight: 'bold', marginBottom: '1.6rem' }}>
            <Union width="1em" height="1em" /> My accounts
          </Text.Body>
          <Menu.Item>
            <ListItem
              headlineText="Polkadot.js import"
              overlineText="$356,120.32"
              leadingContent={<Identicon value="1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS" size="4rem" />}
              css={{ paddingRight: 0, paddingLeft: 0 }}
            />
          </Menu.Item>
          <Menu.Item>
            <ListItem
              headlineText="Polkadot.js import"
              overlineText="$356,120.32"
              leadingContent={<Identicon value="1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS" size="4rem" />}
              css={{ paddingRight: 0, paddingLeft: 0 }}
            />
          </Menu.Item>
          <Menu.Item>
            <ListItem
              headlineText="Add account"
              leadingContent={
                <IconButton as="figure">
                  <Plus />
                </IconButton>
              }
              css={{ paddingRight: 0, paddingLeft: 0 }}
            />
          </Menu.Item>
        </section>
        <section>
          <Text.Body as="header" css={{ fontWeight: 'bold', marginBottom: '1.6rem' }}>
            <Eye width="1em" height="1em" /> Watched accounts
          </Text.Body>
          <Menu.Item>
            <ListItem
              headlineText="Polkadot.js import"
              overlineText="$356,120.32"
              leadingContent={<Identicon value="1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS" size="4rem" />}
              trailingContent={
                <IconButton>
                  <Trash2 />
                </IconButton>
              }
              css={{ paddingRight: 0, paddingLeft: 0 }}
            />
          </Menu.Item>
          <Menu.Item>
            <ListItem
              headlineText="Add watch only address"
              leadingContent={
                <IconButton as="figure">
                  <Eye />
                </IconButton>
              }
              css={{ paddingRight: 0, paddingLeft: 0 }}
            />
          </Menu.Item>
        </section>
      </section>
    </Menu.Items>,
  ],
}
