import AccountConnectionGuard from '@components/widgets/AccountConnectionGuard'
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
  ],
} satisfies RouteObject

export default routes
