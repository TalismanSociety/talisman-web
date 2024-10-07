import Layout from './layout'
import Swap from './swap'
import Xcm from './xcm'
import { type RouteObject } from 'react-router-dom'

const routes = {
  element: <Layout />,
  children: [
    { path: 'swap', element: <Swap /> },
    { path: 'xcm', element: <Xcm /> },
  ],
} satisfies RouteObject

export default routes
