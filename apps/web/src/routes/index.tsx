import { Total } from '@archetypes/Wallet'
import { ModalProvider } from '@components'
import AccountsManagementMenu from '@components/widgets/AccountsManagementMenu'
import { RouteErrorElement } from '@components/widgets/ErrorBoundary'
import StakeDialog from '@components/widgets/StakeWidget'
import { accountsState, legacySelectedAccountState } from '@domains/accounts/recoils'
import { apiState, nativeTokenDecimalState, nativeTokenPriceState } from '@domains/chains/recoils'
import { recommendedPoolsState } from '@domains/nominationPools/recoils'
import * as MoonbeamContributors from '@libs/moonbeam-contributors'
import * as Sentry from '@sentry/react'
import { Compass, CreditCard, Eye, Star, TalismanHand, Zap } from '@talismn/icons'
import { AccountValueInfo, IconButton, NavigationBar, NavigationRail, Scaffold, Text, TopAppBar } from '@talismn/ui'
import posthog from 'posthog-js'
import { useEffect } from 'react'
import { Link, Navigate, Outlet, createBrowserRouter, useLocation } from 'react-router-dom'
import { useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'

import AssetItem from './AssetItem'
import Assets from './Assets'
import CrowdloanDetail from './Crowdloan.Detail'
import CrowdloanIndex from './Crowdloan.Index'
import Explore from './Explore'
import NFTsPage from './NFTsPage'
import Overview from './Overview'
import Portfolio from './Portfolio'
import TransactionHistory from './TransactionHistory'

const Header = () => {
  const account = useRecoilValue(legacySelectedAccountState)
  return (
    <div css={{ margin: '4rem 0' }}>
      <AccountValueInfo address={account?.address ?? ''} name={account?.name ?? 'All Accounts'} balance={<Total />} />
    </div>
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
        <Scaffold
          topBar={
            <TopAppBar
              navigationIcon={
                <IconButton as={Link} to="/">
                  <TalismanHand />
                </IconButton>
              }
              actions={
                <TopAppBar.Actions>
                  <AccountsManagementMenu />
                </TopAppBar.Actions>
              }
            />
          }
          bottomBar={
            <NavigationBar>
              <Link to="/portfolio">
                <NavigationBar.Item label="Portfolio" icon={<Eye />} />
              </Link>
              <Link to="/portfolio?action=stake">
                <NavigationBar.Item label="Staking" icon={<Zap />} />
              </Link>
              <Link to="/explore">
                <NavigationBar.Item label="Explore" icon={<Compass />} />
              </Link>
              <Link to="/crowdloans">
                <NavigationBar.Item label="Crowdloans" icon={<Star />} />
              </Link>
              <Link to="https://talisman.banxa.com/" target="_blank">
                <NavigationBar.Item label="Buy" icon={<CreditCard />} />
              </Link>
            </NavigationBar>
          }
          sideBar={
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
              <Link to="/portfolio?action=stake">
                <NavigationRail.Item label="Staking" icon={<Zap />} />
              </Link>
              <Link to="/explore">
                <NavigationRail.Item label="Explore" icon={<Compass />} />
              </Link>
              <Link to="/crowdloans">
                <NavigationRail.Item label="Crowdloans" icon={<Star />} />
              </Link>
              <Link to="https://talisman.banxa.com/" target="_blank">
                <NavigationRail.Item label="Buy" icon={<CreditCard />} />
              </Link>
            </NavigationRail>
          }
          footer={
            <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text.BodyLarge>TalismanPortal</Text.BodyLarge>
              <ul css={{ display: 'flex', gap: '3.2rem' }}>
                <Text.BodyLarge as="a" href="https://twitter.com/wearetalisman" target="_blank">
                  Twitter
                </Text.BodyLarge>
                <Text.BodyLarge as="a" href="https://discord.gg/talisman" target="_blank">
                  Discord
                </Text.BodyLarge>
                <Text.BodyLarge as="a" href="https://docs.talisman.xyz" target="_blank">
                  Docs
                </Text.BodyLarge>
                <Text.BodyLarge
                  as="a"
                  href="https://docs.talisman.xyz/talisman/legal-and-security/terms-of-use"
                  target="_blank"
                >
                  Terms
                </Text.BodyLarge>
                <Text.BodyLarge
                  as="a"
                  href="https://docs.talisman.xyz/talisman/legal-and-security/privacy-policy"
                  target="_blank"
                >
                  Privacy
                </Text.BodyLarge>
              </ul>
            </div>
          }
        >
          <Header />
          <Outlet />
        </Scaffold>
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
      { path: 'staking', element: <Navigate to="/portfolio?action=stake" /> },
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
