import { RouteErrorElement } from '@components/widgets/ErrorBoundary'
import * as Sentry from '@sentry/react'
import { Navigate, createBrowserRouter, useSearchParams } from 'react-router-dom'
import crowdloanRoutes from './crowdloans'
import dexRoutes from './dex'
import Explore from './explore'
import Layout from './layout'
import portfolioRoutes from './portfolio'

const NavigateToStaking = () => {
  const [search] = useSearchParams()
  search.set('action', 'stake')
  search.sort()
  return <Navigate to={{ pathname: '/portfolio', search: search.toString() }} />
}

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
      { path: 'dex', ...dexRoutes },
      { path: 'explore', element: <Explore /> },
      {
        path: 'crowdloans',
        ...crowdloanRoutes,
      },
      { path: 'history', element: <Navigate to="/portfolio/history" /> },
      { path: 'nfts', element: <Navigate to="/portfolio/collectibles" /> },
      { path: 'staking', element: <NavigateToStaking /> },
      { path: 'transport', element: <Navigate to="/portfolio?action=transport" /> },
    ],
  },
  { path: '*', element: <Navigate to="/" /> },
])
