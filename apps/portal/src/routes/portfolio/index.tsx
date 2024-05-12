import AccountConnectionGuard from '../../components/widgets/AccountConnectionGuard'
import assetRoutes from './assets'
import Collectibles from './collectibles'
import Layout from './layout'
import Overview from './overview'
import type { RouteObject } from 'react-router-dom'

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
