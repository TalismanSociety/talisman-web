import type { RouteObject } from 'react-router-dom'
import CrowdloanDetail from './item'
import CrowdloanIndex from './main'

const routes = {
  children: [
    { path: '', element: <CrowdloanIndex /> },
    { path: ':slug', element: <CrowdloanDetail /> },
  ],
} satisfies RouteObject

export default routes
