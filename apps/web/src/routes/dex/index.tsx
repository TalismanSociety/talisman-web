import { Navigate, type RouteObject } from 'react-router-dom'
import Layout from './layout'
import Swap from './swap'

const routes = {
  element: <Layout />,
  children: [
    { path: 'swap', element: <Swap /> },
    { path: 'transport', lazy: async () => ({ Component: (await import('./transport')).default }) },
    { path: '', element: <Navigate to="swap" /> },
  ],
} satisfies RouteObject

export default routes
