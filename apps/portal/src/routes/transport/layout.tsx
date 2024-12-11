import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import { TalismanHandProgressIndicator } from '@talismn/ui/atoms/TalismanHandProgressIndicator'
import { HiddenDetails } from '@talismn/ui/molecules/HiddenDetails'
import { Tabs } from '@talismn/ui/molecules/Tabs'
import { Suspense, useTransition } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { AccountConnectionGuard } from '@/components/widgets/AccountConnectionGuard'
import { ErrorBoundary } from '@/components/widgets/ErrorBoundary'

const Layout = () => {
  const navigate = useNavigate()
  const [pending, startTransition] = useTransition()

  return (
    <AccountConnectionGuard>
      <div className="mt-[64px] flex flex-col items-center">
        <ErrorBoundary>
          <Suspense fallback={<TalismanHandProgressIndicator />}>
            <div className="mx-auto w-full max-w-[840px]">
              <Tabs css={{ width: 'fit-content', marginLeft: 16, marginRight: 16 }} noBottomBorder>
                <NavLink to="/transport/swap" css={{ display: 'contents' }} onClick={event => event.preventDefault()}>
                  {({ isActive }) => (
                    <Tabs.Item
                      className="whitespace-nowrap !text-[14px] sm:!text-[18px]"
                      selected={isActive}
                      onClick={() => startTransition(() => navigate('/transport/swap'))}
                    >
                      <span className="whitespace-nowrap !text-[14px] font-semibold sm:!text-[18px]">
                        Cross-chain Swap
                      </span>
                    </Tabs.Item>
                  )}
                </NavLink>
                <NavLink to="/transport/xcm" css={{ display: 'contents' }} onClick={event => event.preventDefault()}>
                  {({ isActive }) => (
                    <Tabs.Item selected={isActive} onClick={() => startTransition(() => navigate('/transport/xcm'))}>
                      <span className="whitespace-nowrap !text-[14px] font-semibold sm:!text-[18px]">Polkadot XCM</span>
                    </Tabs.Item>
                  )}
                </NavLink>
              </Tabs>
              <div className="w-full pb-[40px]">
                <HiddenDetails overlay={<CircularProgressIndicator size="4em" />} hidden={pending}>
                  <Outlet />
                </HiddenDetails>
              </div>
            </div>
          </Suspense>
        </ErrorBoundary>
      </div>
    </AccountConnectionGuard>
  )
}

export default Layout
