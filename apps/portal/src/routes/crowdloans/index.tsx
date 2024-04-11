import type { RouteObject } from 'react-router-dom'
import { CrowdloanDetail } from './item'
import { CrowdloanIndex } from './main'
import { CrowdloanParticipated } from './participated'

const routes = {
  children: [
    { path: '', element: <CrowdloanIndex /> },
    { path: ':slug', element: <CrowdloanDetail /> },
    { path: 'participated', element: <CrowdloanParticipated /> },
  ],
} satisfies RouteObject

export default routes
