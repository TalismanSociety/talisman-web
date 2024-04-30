import { Tabs } from '@talismn/ui'
import { NavLink, Outlet } from 'react-router-dom'

const Layout = () => (
  <div
    css={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    <div>
      <div css={{ width: '86rem' }}>
        <Tabs css={{ width: 'fit-content', marginBottom: '1.6rem' }}>
          <NavLink to="/transfer/transport" css={{ display: 'contents' }}>
            {({ isActive }) => <Tabs.Item selected={isActive}>Transport</Tabs.Item>}
          </NavLink>
          <NavLink to="/transfer/swap" css={{ display: 'contents' }}>
            {({ isActive }) => <Tabs.Item selected={isActive}>Swap</Tabs.Item>}
          </NavLink>
        </Tabs>
      </div>
      <div css={{ display: 'flex', justifyContent: 'center' }}>
        <Outlet />
      </div>
    </div>
  </div>
)

export default Layout
