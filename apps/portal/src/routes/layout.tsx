import { usePostHog } from 'posthog-js/react'
import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { ModalProvider } from '@/components/legacy/Modal'
import { FullscreenLoader } from '@/components/molecules/FullscreenLoader'
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

  return (
    <div className="flex min-h-screen flex-col gap-8">
      <SiteNav contentClassName="mx-auto w-full max-w-screen-xl px-8" />

      <Suspense fallback={<FullscreenLoader />}>
        <main className="mx-auto w-full max-w-screen-xl flex-grow px-8">
          {/* TODO: remove legacy imperative modals */}
          <ModalProvider>
            <Outlet />
            <NominationPoolsStakeSideSheet />
            <DappStakingStakeSideSheet />
            <SubtensorStakeSideSheet />
            <SlpxStakeSideSheet />
            <LidoStakeSideSheet />
            <SlpxSubstrateStakeSideSheet />
            <WalletConnectionSideSheet />
          </ModalProvider>
        </main>

        <SiteFooter className="mx-auto w-full max-w-screen-xl px-8" />
      </Suspense>
    </div>
  )
}
