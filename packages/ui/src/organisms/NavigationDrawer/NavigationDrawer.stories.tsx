import { Global, css } from '@emotion/react'
import { type ComponentMeta, type Story } from '@storybook/react'
import {
  Book,
  Compass,
  CreditCard,
  Eye,
  Github,
  Gitlab,
  RefreshCcw,
  ShoppingCart,
  TalismanHand,
  Zap,
} from '@talismn/icons'

import NavigationDrawer, { type NavigationDrawerProps } from './NavigationDrawer'

export default {
  title: 'Organisms/NavigationDrawer',
  component: NavigationDrawer,
  subcomponents: {
    NavigationDrawerItem: NavigationDrawer.Item,
  },
  decorators: [
    Story => (
      <>
        <Global
          styles={css`
            body {
              background-image: url('https://815904063-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F2G9cEppDnwuwiGautnGv%2Fuploads%2FY0qwQL5TJki0pJbWrjdJ%2Ftalismanmeeting.jpg?alt=media&token=aca2fd60-fe9e-4d5e-84fa-5b8dfa77b0ed');
              background-size: cover;
            }
          `}
        />
        <Story />
      </>
    ),
  ],
} as ComponentMeta<typeof NavigationDrawer>

export const Default: Story<NavigationDrawerProps> = args => <NavigationDrawer {...args} />

Default.args = {
  open: true,
  headerIcon: <TalismanHand />,
  children: [
    <NavigationDrawer.Item key={0} label="Portfolio" icon={<Eye />} />,
    <NavigationDrawer.Item key={1} label="Staking" icon={<Zap />} />,
    <NavigationDrawer.Item key={2} label="Transfer" icon={<RefreshCcw />} />,
    <NavigationDrawer.Item key={3} label="Explore" icon={<Compass />} />,
    <NavigationDrawer.Item key={4} label="Buy crypto" icon={<CreditCard />} />,
  ],
  footer: (
    <NavigationDrawer.Footer>
      <NavigationDrawer.Footer.Icon>
        <Github />
      </NavigationDrawer.Footer.Icon>
      <NavigationDrawer.Footer.Icon>
        <Gitlab />
      </NavigationDrawer.Footer.Icon>
      <NavigationDrawer.Footer.Icon>
        <Book />
      </NavigationDrawer.Footer.Icon>
      <NavigationDrawer.Footer.Icon>
        <ShoppingCart />
      </NavigationDrawer.Footer.Icon>
      <NavigationDrawer.Footer.A>Terms</NavigationDrawer.Footer.A>
      <NavigationDrawer.Footer.A>Privacy</NavigationDrawer.Footer.A>
    </NavigationDrawer.Footer>
  ),
}
