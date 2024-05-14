import Layout from './layout'
import Swap from './swap'
import Xcm from './xcm'
import { Navigate, type RouteObject } from 'react-router-dom'

const routes = {
  element: <Layout />,
  children: [
    { path: 'swap', element: <Swap /> },
    { path: 'xcm', element: <Xcm /> },
    { path: '', element: <Navigate to="swap" /> },
  ],
} satisfies RouteObject

export default routes
