import { Trash } from '@components/atoms/Icon'
import Identicon from '@components/atoms/Identicon'
import { ComponentMeta, Story } from '@storybook/react'

import ListItem, { ListItemProps } from './ListItem'

export default {
  title: 'Molecules/ListItem',
  component: ListItem,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof ListItem>

export const Default: Story<ListItemProps> = (args: any) => <ListItem {...args} />

Default.args = {
  overlineText: 'Polkadot.js import',
  headlineText: '$356,120.32',
  leadingContent: <Identicon value="1YmEYgtfPbwx5Jos1PjKDWRpuJWSpTzytwZgYan6kgiquNS" size="4rem" />,
  trailingContent: <Trash />,
}
