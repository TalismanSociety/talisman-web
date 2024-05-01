import { Tabs, TalismanHandProgressIndicator } from '@talismn/ui'
import { Suspense, startTransition } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

// TODO: hack used to enable usage of transition
const Layout = () => {
  const navigate = useNavigate()
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Suspense fallback={<TalismanHandProgressIndicator />}>
        <div>
          <Tabs css={{ width: 'fit-content', marginBottom: '1.6rem' }}>
            <NavLink to="/transfer/swap" css={{ display: 'contents' }} onClick={event => event.preventDefault()}>
              {({ isActive }) => (
                <Tabs.Item selected={isActive} onClick={() => startTransition(() => navigate('/transfer/swap'))}>
                  Swap
                </Tabs.Item>
              )}
            </NavLink>
            <NavLink to="/transfer/transport" css={{ display: 'contents' }} onClick={event => event.preventDefault()}>
              {({ isActive }) => (
                <Tabs.Item selected={isActive} onClick={() => startTransition(() => navigate('/transfer/transport'))}>
                  Transport
                </Tabs.Item>
              )}
            </NavLink>
          </Tabs>
          <div css={{ width: 'min-content' }}>
            <Outlet />
          </div>
        </div>
      </Suspense>
    </div>
  )
}

export default Layout
