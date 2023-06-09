import { Navigate, type RouteObject } from 'react-router-dom'
import Layout from './layout'
import Swap from './swap'
import Transport from './transport'

const routes = {
  element: <Layout />,
  children: [
    { path: 'swap', element: <Swap /> },
    { path: 'transport', element: <Transport /> },
    { path: '', element: <Navigate to="transport" /> },
  ],
} satisfies RouteObject

export default routes
