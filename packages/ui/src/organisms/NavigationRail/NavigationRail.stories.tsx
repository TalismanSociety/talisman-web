import { IconButton } from '../../atoms'
import NavigationRail, { NavigationRailItem, type NavigationRailProps } from './NavigationRail'
import { type ComponentMeta, type Story } from '@storybook/react'
import { Compass, CreditCard, PieChart, Repeat, Union, Zap } from '@talismn/web-icons'

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
    <NavigationRail.Item key={0} label="Portfolio" icon={<PieChart />} />,
    <NavigationRail.Item key={1} label="Staking" icon={<Zap />} />,
    <NavigationRail.Item key={2} label="Transport" icon={<Repeat />} />,
    <NavigationRail.Item key={3} label="Explore" icon={<Compass />} />,
    <NavigationRail.Item key={4} label="Buy" icon={<CreditCard />} />,
  ],
}
