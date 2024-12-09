import type { RouteObject } from 'react-router-dom'

import { AccountConnectionGuard } from '@/components/widgets/AccountConnectionGuard'

import assetRoutes from './assets'
import Collectibles from './collectibles'
import Layout from './layout'
import Overview from './overview'

const routes = {
  element: (
    // If we suspend while waiting for the wallet, the underlying <Portfolio /> takes a
    // significantly longer time to load due to the <Stakes /> component.
    //
    // TODO: Figure out how to fix the loading time, and then remove `noSuspense` so that we don't
    // show a flash of the `Welcome to the Talisman Portal` UI when loading the page.
    <AccountConnectionGuard noSuspense>
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
