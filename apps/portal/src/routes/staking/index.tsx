// import StakeProviders from '../../components/widgets/staking/StakeProviders'
import Stakes from '../../components/widgets/staking/Stakes'
import Layout from './layout'
import Providers from '@/components/widgets/staking/Providers'
import { Navigate, type RouteObject } from 'react-router-dom'

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
