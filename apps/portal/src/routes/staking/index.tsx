import StakeProviders from '../../components/widgets/staking/StakeProviders'
import Stakes from '../../components/widgets/staking/Stakes'
import Layout from './layout'
import { Navigate, type RouteObject } from 'react-router-dom'

const routes = {
  element: <Layout />,
  children: [
    { path: '', element: <Navigate to="providers" /> },
    { path: 'positions', element: <Stakes hideHeader /> },
    { path: 'providers', element: <StakeProviders /> },
  ],
} satisfies RouteObject

export default routes
