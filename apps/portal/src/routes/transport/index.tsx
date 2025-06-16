import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import { Swap } from '@/components/widgets/swap'
import { AllRoutes } from '@/components/widgets/swap/AllRoutes'
import { Xcm } from '@/components/widgets/xcm'

import Layout from './layout'

const routes = {
  element: <Layout />,
  children: [
    { path: '', element: <Navigate to="swap" /> },
    { path: 'swap', element: <Swap /> },
    { path: 'swap/all-routes', element: <AllRoutes /> },
    { path: 'xcm', element: <Xcm /> },
  ],
} satisfies RouteObject

export default routes
