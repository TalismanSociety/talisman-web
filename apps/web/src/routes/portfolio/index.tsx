import AccountConnectionGuard from '@components/widgets/AccountConnectionGuard'
import type { RouteObject } from 'react-router-dom'
import assetRoutes from './assets'
import Collectibles from './collectibles'
import Layout from './layout'
import Overview from './overview'
import TransactionHistory from './transactionHistory'

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
      element: <TransactionHistory />,
    },
  ],
} satisfies RouteObject

export default routes
