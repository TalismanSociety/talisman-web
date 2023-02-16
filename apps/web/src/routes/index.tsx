import { ModalProvider } from '@components'
import { RouteErrorElement } from '@components/widgets/ErrorBoundary'
import { accountsState } from '@domains/accounts/recoils'
import { apiState, nativeTokenDecimalState, nativeTokenPriceState } from '@domains/chains/recoils'
import { recommendedPoolsState } from '@domains/nominationPools/recoils'
import * as MoonbeamContributors from '@libs/moonbeam-contributors'
import * as Sentry from '@sentry/react'
import posthog from 'posthog-js'
import { useEffect } from 'react'
import { Navigate, Outlet, createBrowserRouter, useLocation } from 'react-router-dom'
import { useRecoilValueLoadable, waitForAll } from 'recoil'

import Layout from '../layout'
import AssetItem from './AssetItem'
import Assets from './Assets'
import Buy from './Buy'
import CrowdloanDetail from './Crowdloan.Detail'
import CrowdloanIndex from './Crowdloan.Index'
import Explore from './Explore'
import NFTsPage from './NFTsPage'
import Overview from './Overview'
import Portfolio from './Portfolio'
import Staking from './Staking'
import TransactionHistory from './TransactionHistory'

const Main = () => {
  // Pre-loading
  useRecoilValueLoadable(
    waitForAll([apiState, accountsState, nativeTokenDecimalState, nativeTokenPriceState('usd'), recommendedPoolsState])
  )

  const location = useLocation()

  useEffect(() => {
    if (location.hash !== '') {
      const observer = new MutationObserver(() => {
        const element = document.getElementById(location.hash.slice(1))

        if (element !== null) {
          element.scrollIntoView({ behavior: 'smooth' })
          observer.disconnect()
        }
      })

      observer.observe(document.body, { childList: true, subtree: true })

      return observer.disconnect.bind(observer)
    }
  }, [location])

  useEffect(() => {
    posthog.capture('$pageview')
  }, [location.pathname])

  return (
    // TODO: remove legacy imperative modals
    <ModalProvider>
      <MoonbeamContributors.PopupProvider>
        <Layout>
          <Outlet />
        </Layout>
      </MoonbeamContributors.PopupProvider>
    </ModalProvider>
  )
}

export default Sentry.wrapCreateBrowserRouter(createBrowserRouter)([
  {
    path: '/',
    element: <Main />,
    errorElement: <RouteErrorElement />,
    children: [
      { path: '/', element: <Navigate to="portfolio" /> },
      {
        path: 'portfolio',
        element: <Portfolio />,
        children: [
          { path: '', element: <Overview /> },
          { path: 'assets', element: <Assets /> },
          { path: 'nfts', element: <NFTsPage /> },
          { path: 'history', element: <TransactionHistory /> },
          { path: 'assets/:assetId', element: <AssetItem /> },
        ],
      },
      { path: 'history', element: <Navigate to="/portfolio/history" /> },
      { path: 'nfts', element: <Navigate to="/portfolio/nfts" /> },
      { path: 'explore', element: <Explore /> },
      { path: 'staking', element: <Staking /> },
      {
        path: 'crowdloans',
        children: [
          { path: '', element: <CrowdloanIndex /> },
          { path: ':slug', element: <CrowdloanDetail /> },
        ],
      },
      { path: 'buy', element: <Buy /> },
    ],
  },
])
