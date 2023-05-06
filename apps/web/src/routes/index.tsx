import { Total } from '@archetypes/Wallet'
import { ReactComponent as Discord } from '@assets/icons/discord-header.svg'
import { ReactComponent as GitHub } from '@assets/icons/github-header.svg'
import { ReactComponent as Medium } from '@assets/icons/medium-header.svg'
import { ReactComponent as Twitter } from '@assets/icons/twitter-header.svg'
import { ModalProvider } from '@components'
import AccountValueInfo from '@components/recipes/AccountValueInfo'
import AccountConnectionGuard, { useShouldShowAccountConnectionGuard } from '@components/widgets/AccountConnectionGuard'
import AccountsManagementMenu from '@components/widgets/AccountsManagementMenu'
import { RouteErrorElement } from '@components/widgets/ErrorBoundary'
import StakeDialog from '@components/widgets/staking/StakeDialog'
import { accountsState, selectedAccountsState } from '@domains/accounts/recoils'
import { useNativeTokenDecimalState, useNativeTokenPriceState } from '@domains/chains/recoils'
import { useRecommendedPoolsState } from '@domains/nominationPools/recoils'
import * as MoonbeamContributors from '@libs/moonbeam-contributors'
import * as Sentry from '@sentry/react'
import { Compass, CreditCard, Eye, MoreHorizontal, RefreshCcw, Star, TalismanHand, Zap } from '@talismn/icons'
import {
  IconButton,
  NavigationBar,
  NavigationDrawer,
  NavigationRail,
  SCAFFOLD_WIDE_VIEW_MEDIA_SELECTOR,
  Scaffold,
  Text,
  TopAppBar,
} from '@talismn/ui'
import { shortenAddress } from '@util/format'
import { usePostHog } from 'posthog-js/react'
import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, Outlet, createBrowserRouter, useLocation, useSearchParams } from 'react-router-dom'
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
import TeleportDialog from '@components/widgets/TeleportDialog'

const Header = () => {
  const shouldShowAccountConnectionGuard = useShouldShowAccountConnectionGuard()
  const accounts = useRecoilValue(selectedAccountsState)

  if (shouldShowAccountConnectionGuard) {
    return null
  }

  return (
    <div css={{ [SCAFFOLD_WIDE_VIEW_MEDIA_SELECTOR]: { marginTop: '4rem' } }}>
      <AccountsManagementMenu
        button={
          <AccountValueInfo
            address={accounts.length === 1 ? accounts[0]!.address : ''}
            name={accounts.length === 1 ? accounts[0]!.name ?? shortenAddress(accounts[0]!.address) : 'All accounts'}
            balance={<Total />}
          />
        }
      />
    </div>
  )
}

const Main = () => {
  // Pre-loading
  useRecoilValueLoadable(
    waitForAll([accountsState, useNativeTokenDecimalState(), useNativeTokenPriceState(), useRecommendedPoolsState()])
  )

  const posthog = usePostHog()
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
    posthog?.capture('$pageview')
  }, [location.pathname, posthog])

  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <Scaffold
      breakpoints={{
        topBar: 'narrow',
        bottomBar: 'narrow',
        sideBar: 'wide',
        drawer: 'narrow',
        footer: 'wide',
      }}
      topBar={
        <TopAppBar
          navigationIcon={
            <IconButton as={Link} to="/">
              <TalismanHand />
            </IconButton>
          }
          actions={
            <TopAppBar.Actions>
              <AccountsManagementMenu button={<AccountsManagementMenu.IconButton />} />
              <IconButton onClick={useCallback(() => setDrawerOpen(true), [])}>
                <MoreHorizontal />
              </IconButton>
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
          <Link to="/portfolio?action=teleport">
            <NavigationBar.Item label="Teleport" icon={<RefreshCcw />} />
          </Link>
          <Link to="/explore">
            <NavigationBar.Item label="Explore" icon={<Compass />} />
          </Link>
          <Link to="/crowdloans">
            <NavigationBar.Item label="Crowdloans" icon={<Star />} />
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
          <Link to="/portfolio">
            <NavigationRail.Item label="Portfolio" icon={<Eye />} />
          </Link>
          <Link to="/portfolio?action=stake">
            <NavigationRail.Item label="Staking" icon={<Zap />} />
          </Link>
          <Link to="/portfolio?action=teleport">
            <NavigationRail.Item label="Teleport" icon={<RefreshCcw />} />
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
      drawer={
        <NavigationDrawer
          open={drawerOpen}
          onRequestDismiss={useCallback(() => setDrawerOpen(false), [])}
          headerIcon={<TalismanHand />}
          footer={
            <NavigationDrawer.Footer>
              <Link to="https://discord.gg/talisman" target="_blank">
                <NavigationDrawer.Footer.Icon>
                  <Discord width="2.4rem" height="2.4rem" />
                </NavigationDrawer.Footer.Icon>
              </Link>
              <Link to="https://github.com/TalismanSociety/talisman-web" target="_blank">
                <NavigationDrawer.Footer.Icon>
                  <GitHub width="2.4rem" height="2.4rem" />
                </NavigationDrawer.Footer.Icon>
              </Link>
              <Link to="https://twitter.com/wearetalisman" target="_blank">
                <NavigationDrawer.Footer.Icon>
                  <Twitter width="2.4rem" height="2.4rem" />
                </NavigationDrawer.Footer.Icon>
              </Link>
              <Link to="https://medium.com/we-are-talisman" target="_blank">
                <NavigationDrawer.Footer.Icon>
                  <Medium width="2.4rem" height="2.4rem" />
                </NavigationDrawer.Footer.Icon>
              </Link>
              <NavigationDrawer.Footer.A
                href="https://docs.talisman.xyz/talisman/legal-and-security/terms-of-use"
                target="_blank"
              >
                Terms
              </NavigationDrawer.Footer.A>
              <NavigationDrawer.Footer.A
                href="https://docs.talisman.xyz/talisman/legal-and-security/privacy-policy"
                target="_blank"
              >
                Privacy
              </NavigationDrawer.Footer.A>
            </NavigationDrawer.Footer>
          }
        >
          <Link to="/portfolio">
            <NavigationDrawer.Item label="Portfolio" icon={<Eye />} />
          </Link>
          <Link to="/portfolio?action=stake">
            <NavigationDrawer.Item label="Staking" icon={<Zap />} />
          </Link>
          <Link to="/portfolio?action=teleport">
            <NavigationDrawer.Item label="Teleport" icon={<RefreshCcw />} />
          </Link>
          <Link to="/crowdloans">
            <NavigationDrawer.Item label="Crowdloans" icon={<Star />} />
          </Link>
          <Link to="/explore">
            <NavigationDrawer.Item label="Explore" icon={<Compass />} />
          </Link>
          <Link to="https://talisman.banxa.com/" target="_blank">
            <NavigationDrawer.Item label="Buy crypto" icon={<CreditCard />} />
          </Link>
        </NavigationDrawer>
      }
      footer={
        <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2.4rem' }}>
          <Text.BodyLarge>Talisman Portal</Text.BodyLarge>
          <ul
            css={theme => ({
              display: 'flex',
              gap: '3.2rem',
              a: { 'opacity': theme.contentAlpha.medium, ':hover': { opacity: theme.contentAlpha.high } },
            })}
          >
            <Text.BodyLarge alpha="high" as="a" href="https://twitter.com/wearetalisman" target="_blank">
              Twitter
            </Text.BodyLarge>
            <Text.BodyLarge alpha="high" as="a" href="https://discord.gg/talisman" target="_blank">
              Discord
            </Text.BodyLarge>
            <Text.BodyLarge alpha="high" as="a" href="https://docs.talisman.xyz" target="_blank">
              Docs
            </Text.BodyLarge>
            <Text.BodyLarge
              alpha="high"
              as="a"
              href="https://docs.talisman.xyz/talisman/legal-and-security/terms-of-use"
              target="_blank"
            >
              Terms
            </Text.BodyLarge>
            <Text.BodyLarge
              alpha="high"
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
      {/* TODO: remove legacy imperative modals */}
      <ModalProvider>
        <MoonbeamContributors.PopupProvider>
          <Header />
          <Outlet />
          <StakeDialog />
          <TeleportDialog />
        </MoonbeamContributors.PopupProvider>
      </ModalProvider>
    </Scaffold>
  )
}

const NavigateToStaking = () => {
  const [search] = useSearchParams()
  search.set('action', 'stake')
  search.sort()
  return <Navigate to={{ pathname: '/portfolio', search: search.toString() }} />
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
        element: (
          <AccountConnectionGuard>
            <Portfolio />
          </AccountConnectionGuard>
        ),
        children: [
          { path: '', element: <Overview /> },
          { path: 'assets', element: <Assets /> },
          {
            path: 'nfts',
            element: (
              <AccountConnectionGuard>
                <NFTsPage />
              </AccountConnectionGuard>
            ),
          },
          {
            path: 'history',
            element: (
              <AccountConnectionGuard>
                <TransactionHistory />
              </AccountConnectionGuard>
            ),
          },
          {
            path: 'assets/:assetId',
            element: (
              <AccountConnectionGuard>
                <AssetItem />
              </AccountConnectionGuard>
            ),
          },
        ],
      },
      { path: 'history', element: <Navigate to="/portfolio/history" /> },
      { path: 'nfts', element: <Navigate to="/portfolio/nfts" /> },
      { path: 'explore', element: <Explore /> },
      {
        path: 'staking',
        element: <NavigateToStaking />,
      },
      { path: 'teleport', element: <Navigate to="/portfolio?action=teleport" /> },
      {
        path: 'staking',
        element: <NavigateToStaking />,
      },
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
