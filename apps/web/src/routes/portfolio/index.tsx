import AccountConnectionGuard from '@components/widgets/AccountConnectionGuard'
import { Text } from '@talismn/ui'
import type { RouteObject } from 'react-router-dom'
import assetRoutes from './assets'
import Collectibles from './collectibles'
import Layout from './layout'
import Overview from './overview'

const routes = {
  element: (
    <AccountConnectionGuard>
      <Layout />
    </AccountConnectionGuard>
  ),
  children: [
    { path: '', element: <Overview /> },
    { path: 'assets', ...assetRoutes },
    {
      path: 'collectibles',
      element: <Collectibles />,
    },
    {
      path: 'history',
      element: (
        <div css={{ textAlign: 'center', margin: '5rem 0' }}>
          <Text.H2>Transaction history is currently under maintenance</Text.H2>
          <Text.H3>Please check back again later</Text.H3>
        </div>
      ),
    },
  ],
} satisfies RouteObject

export default routes
