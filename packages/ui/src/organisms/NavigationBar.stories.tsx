import { type ComponentMeta, type Story } from '@storybook/react'
import { Compass, CreditCard, PieChart, Repeat, Zap } from '@talismn/web-icons'

import type { NavigationBarProps } from './NavigationBar'
import { NavigationBar, NavigationBarItem } from './NavigationBar'

export default {
  title: 'Organisms/NavigationBar',
  component: NavigationBar,
  subcomponents: {
    NavigationBarItem,
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div css={{ position: 'fixed', right: 0, bottom: 0, left: 0 }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof NavigationBar>

export const Default: Story<NavigationBarProps> = args => <NavigationBar {...args} />

Default.args = {
  children: [
    <NavigationBar.Item key={0} label="Portfolio" icon={<PieChart />} />,
    <NavigationBar.Item key={1} label="Staking" icon={<Zap />} />,
    <NavigationBar.Item key={2} label="Transport" icon={<Repeat />} />,
    <NavigationBar.Item key={3} label="Explore" icon={<Compass />} />,
    <NavigationBar.Item key={4} label="Buy" icon={<CreditCard />} />,
  ],
}
