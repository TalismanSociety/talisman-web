import { type ComponentMeta, type Story } from '@storybook/react'
import { Trash } from '@talismn/web-icons'

import type { ListItemProps } from './ListItem'
import { Identicon } from '../atoms/Identicon'
import { ListItem } from './ListItem'

export default {
  title: 'Molecules/ListItem',
  component: ListItem,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof ListItem>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Default: Story<ListItemProps> = (args: any) => <ListItem {...args} />

Default.args = {
  overlineContent: 'Polkadot.js import',
  headlineContent: '$356,120.32',
  leadingContent: <Identicon value="1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS" size="4rem" />,
  trailingContent: <Trash />,
}
