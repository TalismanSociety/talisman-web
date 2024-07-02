import AccountConnectionGuard from '../../components/widgets/AccountConnectionGuard'
import ErrorBoundary from '../../components/widgets/ErrorBoundary'
import { CircularProgressIndicator, HiddenDetails, Tabs, TalismanHandProgressIndicator } from '@talismn/ui'
import { Suspense, useTransition } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

// TODO: hack used to enable usage of transition
const Layout = () => {
  const navigate = useNavigate()
  const [pending, startTransition] = useTransition()

  return (
    <AccountConnectionGuard>
      <div className="flex flex-col items-center mt-[64px]">
        <ErrorBoundary>
          <Suspense fallback={<TalismanHandProgressIndicator />}>
            <div className="w-full max-w-[840px] mx-auto">
              <Tabs css={{ width: 'fit-content', marginBottom: '1.6rem', marginLeft: 16, marginRight: 16 }}>
                <NavLink to="/transport/swap" css={{ display: 'contents' }} onClick={event => event.preventDefault()}>
                  {({ isActive }) => (
                    <Tabs.Item
                      className="whitespace-nowrap !text-[14px] sm:!text-[18px]"
                      selected={isActive}
                      onClick={() => startTransition(() => navigate('/transport/swap'))}
                    >
                      <span className="whitespace-nowrap !text-[14px] sm:!text-[18px] font-semibold">
                        Cross-chain Swap
                      </span>
                    </Tabs.Item>
                  )}
                </NavLink>
                <NavLink to="/transport/xcm" css={{ display: 'contents' }} onClick={event => event.preventDefault()}>
                  {({ isActive }) => (
                    <Tabs.Item selected={isActive} onClick={() => startTransition(() => navigate('/transport/xcm'))}>
                      <span className="whitespace-nowrap !text-[14px] sm:!text-[18px] font-semibold">
                        Polkadot (XCM)
                      </span>
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
