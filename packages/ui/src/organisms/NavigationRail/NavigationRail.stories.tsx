import { ComponentMeta, Story } from '@storybook/react'
import { Compass, CreditCard, Eye, RefreshCcw, Union, Zap } from '@talismn/icons'

import { IconButton } from '../../atoms'
import NavigationRail, { NavigationRailItem, NavigationRailProps } from './NavigationRail'

export default {
  title: 'Organisms/NavigationRail',
  component: NavigationRail,
  subcomponents: {
    NavigationRailItem,
  },
} as ComponentMeta<typeof NavigationRail>

export const Default: Story<NavigationRailProps> = args => <NavigationRail {...args} />

Default.args = {
  header: (
    <IconButton>
      <Union />
    </IconButton>
  ),
  children: [
    <NavigationRailItem key={0} label="Portfolio">
      <Eye />
    </NavigationRailItem>,
    <NavigationRailItem key={1} label="Staking">
      <Zap />
    </NavigationRailItem>,
    <NavigationRailItem key={2} label="Transfer">
      <RefreshCcw />
    </NavigationRailItem>,
    <NavigationRailItem key={3} label="Explore">
      <Compass />
    </NavigationRailItem>,
    <NavigationRailItem key={4} label="Buy">
      <CreditCard />
    </NavigationRailItem>,
  ],
}
