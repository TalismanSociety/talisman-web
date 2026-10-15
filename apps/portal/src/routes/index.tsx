import * as Sentry from '@sentry/react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { RouteErrorElement } from '@/components/widgets/ErrorBoundary'

import { Layout } from './layout'
import portfolioRoutes from './portfolio'
import stakingRoutes from './staking'

export default Sentry.wrapCreateBrowserRouter(createBrowserRouter)([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteErrorElement />,
    children: [
      { path: '/', element: <Navigate to="staking" /> },
      { path: 'portfolio', ...portfolioRoutes },
      { path: 'transport/*', element: <Navigate to="/staking" /> },
      { path: 'nfts', element: <Navigate to="/portfolio/collectibles" /> },
      { path: 'staking', ...stakingRoutes },
      { path: 'admin', element: <Navigate to="/staking" /> },
    ],
  },
  { path: '*', element: <Navigate to="/" /> },
])
