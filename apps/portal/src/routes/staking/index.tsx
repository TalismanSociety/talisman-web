import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import { StakeProviders } from '@/components/widgets/staking/providers/StakeProviders'
import Stakes from '@/components/widgets/staking/Stakes'
import { Subnet } from '@/components/widgets/staking/Subnet'

import Layout from './layout'

const routes = {
  element: <Layout />,
  children: [
    { path: '', element: <Navigate to="providers" /> },
    { path: 'positions', element: <Stakes hideHeader /> },
    { path: 'providers', element: <StakeProviders /> },
    { path: 'subnet/:subnetId', element: <Subnet /> },
  ],
} satisfies RouteObject

export default routes
