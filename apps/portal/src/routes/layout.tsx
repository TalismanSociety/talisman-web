import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { ModalProvider } from '@/components/legacy/Modal'
import { HeaderWidgetPortalProvider, TitlePortalProvider } from '@/components/molecules/PageHeader'
import { SiteFooter } from '@/components/widgets/SiteFooter'
import { SiteNav } from '@/components/widgets/SiteNav'
import DappStakingStakeSideSheet from '@/components/widgets/staking/dappStaking/StakeSideSheet'
import LidoStakeSideSheet from '@/components/widgets/staking/lido/StakeSideSheet'
import SlpxStakeSideSheet from '@/components/widgets/staking/slpx/StakeSideSheet'
import SlpxSubstrateStakeSideSheet from '@/components/widgets/staking/slpxSubstrate/StakeSideSheet'
import NominationPoolsStakeSideSheet from '@/components/widgets/staking/substrate/NominationPoolsStakeSideSheet'
import { StakeSideSheet as SubtensorStakeSideSheet } from '@/components/widgets/staking/subtensor/StakeSideSheet'
import { WalletConnectionSideSheet } from '@/components/widgets/WalletConnectionSideSheet'

export const Layout = () => {
  const location = useLocation()
  const posthog = usePostHog()

  useEffect(() => {
    posthog?.capture('$pageview')
  }, [location.pathname, posthog])

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

  // const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col gap-8">
      <SiteNav contentClassName="mx-auto w-full max-w-screen-xl px-8" />

      <main className="mx-auto w-full max-w-screen-xl flex-grow px-8">
        {/* <Scaffold
    //   breakpoints={{
    //     topBar: 'narrow',
    //     bottomBar: 'narrow',
    //     sideBar: 'wide',
    //     drawer: 'narrow',
    //     footer: 'wide',
    //   }}
    //   topBar={<SiteNavTopBar openDrawer={() => setDrawerOpen(true)} />}
    //   bottomBar={<SiteNavBottomBar />}
    //   sideBar={<SiteNavSidebar />}
    //   drawer={<SiteNavDrawer isOpen={drawerOpen} close={() => setDrawerOpen(false)} />}
    //   footer={<SiteFooter />}
    // > */}
        {/* TODO: remove legacy imperative modals */}
        <ModalProvider>
          <TitlePortalProvider>
            <HeaderWidgetPortalProvider>
              {/* <PageHeader /> */}
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
      </main>

      <SiteFooter className="mx-auto w-full max-w-screen-xl px-8" />
    </div>
  )
}
