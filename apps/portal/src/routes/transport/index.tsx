import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import Layout from './layout'
import Swap from './swap'
import Xcm from './xcm'

const routes = {
  element: <Layout />,
  children: [
    { path: '', element: <Navigate to="swap" /> },
    { path: 'swap', element: <Swap /> },
    { path: 'xcm', element: <Xcm /> },
  ],
} satisfies RouteObject

export default routes
