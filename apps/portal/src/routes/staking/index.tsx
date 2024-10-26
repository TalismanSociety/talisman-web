// import StakeProviders from '../../components/widgets/staking/StakeProviders'
import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import Providers from '@/components/widgets/staking/providers'

import Stakes from '../../components/widgets/staking/Stakes'
import Layout from './layout'

const routes = {
  element: <Layout />,
  children: [
    { path: '', element: <Navigate to="providers" /> },
    { path: 'positions', element: <Stakes hideHeader /> },
    // { path: 'providers', element: <StakeProviders /> },
    { path: 'providers', element: <Providers /> },
  ],
} satisfies RouteObject

export default routes
