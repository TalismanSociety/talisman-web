import AccountConnectionGuard from '@components/widgets/AccountConnectionGuard'
import { RouteErrorElement } from '@components/widgets/ErrorBoundary'
import * as Sentry from '@sentry/react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import crowdloanRoutes from './crowdloans'
import dexRoutes from './dex'
import Explore from './explore'
import History from './history'
import Layout from './layout'
import portfolioRoutes from './portfolio'
import Staking from './staking'

export default Sentry.wrapCreateBrowserRouter(createBrowserRouter)([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteErrorElement />,
    children: [
      { path: '/', element: <Navigate to="portfolio" /> },
      {
        path: 'portfolio',
        ...portfolioRoutes,
      },
      { path: 'transfer', ...dexRoutes },
      { path: 'explore', element: <Explore /> },
      {
        path: 'crowdloans',
        ...crowdloanRoutes,
      },
      {
        path: 'history',
        element: (
          <AccountConnectionGuard>
            <History />
          </AccountConnectionGuard>
        ),
      },
      { path: 'nfts', element: <Navigate to="/portfolio/collectibles" /> },
      { path: 'staking', element: <Staking /> },
      // TODO: remove once link on extension side is updated
      { path: '/portfolio/history', element: <Navigate to="/history" /> },
    ],
  },
  { path: '*', element: <Navigate to="/" /> },
])
