import { Scaffold } from '@talismn/ui/organisms/Scaffold'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { ModalProvider } from '@/components/legacy/Modal'
import { HeaderWidgetPortalProvider, PageHeader, TitlePortalProvider } from '@/components/molecules/PageHeader'
import { SiteFooter } from '@/components/widgets/SiteFooter'
import { SiteNavBottomBar, SiteNavDrawer, SiteNavSidebar, SiteNavTopBar } from '@/components/widgets/SiteNav'
import DappStakingStakeSideSheet from '@/components/widgets/staking/dappStaking/StakeSideSheet'
import LidoStakeSideSheet from '@/components/widgets/staking/lido/StakeSideSheet'
import SlpxStakeSideSheet from '@/components/widgets/staking/slpx/StakeSideSheet'
import SlpxSubstrateStakeSideSheet from '@/components/widgets/staking/slpxSubstrate/StakeSideSheet'
import NominationPoolsStakeSideSheet from '@/components/widgets/staking/substrate/NominationPoolsStakeSideSheet'
import { StakeSideSheet as SubtensorStakeSideSheet } from '@/components/widgets/staking/subtensor/StakeSideSheet'
import { WalletConnectionSideSheet } from '@/components/widgets/WalletConnectionSideSheet'

const Layout = () => {
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

    return undefined
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
      topBar={<SiteNavTopBar openDrawer={() => setDrawerOpen(true)} />}
      bottomBar={<SiteNavBottomBar />}
      sideBar={<SiteNavSidebar />}
      drawer={<SiteNavDrawer isOpen={drawerOpen} close={() => setDrawerOpen(false)} />}
      footer={<SiteFooter />}
    >
      {/* TODO: remove legacy imperative modals */}
      <ModalProvider>
        <TitlePortalProvider>
          <HeaderWidgetPortalProvider>
            <PageHeader />
            <Outlet />
            <NominationPoolsStakeSideSheet />
            <DappStakingStakeSideSheet />
            <SubtensorStakeSideSheet />
            <SlpxStakeSideSheet />
            <LidoStakeSideSheet />
            <SlpxSubstrateStakeSideSheet />
            <WalletConnectionSideSheet />
          </HeaderWidgetPortalProvider>
        </TitlePortalProvider>
      </ModalProvider>
    </Scaffold>
  )
}

export default Layout
