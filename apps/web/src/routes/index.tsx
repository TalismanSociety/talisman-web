import { ModalProvider } from '@components'
import AccountsManagementMenu from '@components/widgets/AccountsManagementMenu'
import { RouteErrorElement } from '@components/widgets/ErrorBoundary'
import StakeDialog, { stakeDialogOpenState } from '@components/widgets/StakeWidget'
import { accountsState } from '@domains/accounts/recoils'
import { apiState, nativeTokenDecimalState, nativeTokenPriceState } from '@domains/chains/recoils'
import { recommendedPoolsState } from '@domains/nominationPools/recoils'
import * as MoonbeamContributors from '@libs/moonbeam-contributors'
import * as Sentry from '@sentry/react'
import { Compass, CreditCard, Eye, TalismanHand, Zap } from '@talismn/icons'
import { IconButton, NavigationRail } from '@talismn/ui'
import posthog from 'posthog-js'
import { useCallback, useEffect } from 'react'
import { Link, Navigate, Outlet, createBrowserRouter, useLocation } from 'react-router-dom'
import { useRecoilValueLoadable, useSetRecoilState, waitForAll } from 'recoil'

import AssetItem from './AssetItem'
import Assets from './Assets'
import CrowdloanDetail from './Crowdloan.Detail'
import CrowdloanIndex from './Crowdloan.Index'
import Explore from './Explore'
import NFTsPage from './NFTsPage'
import Overview from './Overview'
import Portfolio from './Portfolio'
import Staking from './Staking'
import TransactionHistory from './TransactionHistory'

const Navigation = () => {
  const setStakeDialogOpen = useSetRecoilState(stakeDialogOpenState)
  return (
    <NavigationRail
      header={
        <IconButton as={Link} to="/">
          <TalismanHand />
        </IconButton>
      }
    >
      <AccountsManagementMenu />
      <Link to="/portfolio">
        <NavigationRail.Item label="Portfolio" icon={<Eye />} />
      </Link>
      <NavigationRail.Item
        label="Staking"
        icon={<Zap />}
        onClick={useCallback(() => setStakeDialogOpen(true), [setStakeDialogOpen])}
      />
      <Link to="/explore">
        <NavigationRail.Item label="Explore" icon={<Compass />} />
      </Link>
      <Link to="https://talisman.banxa.com/" target="_blank">
        <NavigationRail.Item label="Buy" icon={<CreditCard />} />
      </Link>
    </NavigationRail>
  )
}

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
        <div
          css={{
            'display': 'grid',
            'gridTemplateAreas': `
              'main'
              'nav'
            `,
            '@media(min-width: 1024px)': {
              padding: '2.4rem',
              gap: '4.8rem',
              gridTemplateColumns: 'min-content 1fr',
              gridTemplateAreas: `
                'nav main'
                'footer footer'
              `,
            },
          }}
        >
          <div css={{ gridArea: 'nav' }}>
            <div css={{ position: 'fixed' }}>
              <Navigation />
            </div>
            {/* Filler */}
            <div css={{ visibility: 'hidden' }}>
              <Navigation />
            </div>
          </div>
          <main css={{ gridArea: 'main' }}>
            <Outlet />
          </main>
        </div>
        <StakeDialog />
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
    ],
  },
  { path: '*', element: <Navigate to="/" /> },
])
