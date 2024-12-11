import * as Sentry from '@sentry/react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { RouteErrorElement } from '@/components/widgets/ErrorBoundary'

import Admin from './admin'
import { Layout } from './layout'
import portfolioRoutes from './portfolio'
import stakingRoutes from './staking'
import dexRoutes from './transport'

export default Sentry.wrapCreateBrowserRouter(createBrowserRouter)([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteErrorElement />,
    children: [
      { path: '/', element: <Navigate to="portfolio" /> },
      { path: 'portfolio', ...portfolioRoutes },
      { path: 'transport', ...dexRoutes },
      { path: 'nfts', element: <Navigate to="/portfolio/collectibles" /> },
      { path: 'staking', ...stakingRoutes },
      { path: '/admin', element: <Admin /> },
    ],
  },
  { path: '*', element: <Navigate to="/" /> },
])
