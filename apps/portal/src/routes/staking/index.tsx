import StakeProviders from '../../components/widgets/staking/StakeProviders'
import Stakes from '../../components/widgets/staking/Stakes'
import { Navigate, type RouteObject } from 'react-router-dom'
import Layout from './layout'

const routes = {
  element: <Layout />,
  children: [
    { path: '', element: <Navigate to="providers" /> },
    { path: 'positions', element: <Stakes hideHeader /> },
    { path: 'providers', element: <StakeProviders /> },
  ],
} satisfies RouteObject

export default routes
