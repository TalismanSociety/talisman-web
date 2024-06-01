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
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <ErrorBoundary>
          <Suspense fallback={<TalismanHandProgressIndicator />}>
            <div>
              <Tabs css={{ width: 'fit-content', marginBottom: '1.6rem' }}>
                <NavLink to="/transport/swap" css={{ display: 'contents' }} onClick={event => event.preventDefault()}>
                  {({ isActive }) => (
                    <Tabs.Item selected={isActive} onClick={() => startTransition(() => navigate('/transport/swap'))}>
                      Swap
                    </Tabs.Item>
                  )}
                </NavLink>
                <NavLink to="/transport/xcm" css={{ display: 'contents' }} onClick={event => event.preventDefault()}>
                  {({ isActive }) => (
                    <Tabs.Item selected={isActive} onClick={() => startTransition(() => navigate('/transport/xcm'))}>
                      XCM
                    </Tabs.Item>
                  )}
                </NavLink>
              </Tabs>
              <div css={{ width: 'min-content' }}>
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
