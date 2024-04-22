import ErrorBoundary from '@components/widgets/ErrorBoundary'
import { TitlePortal } from '@routes/layout'
import { Tabs } from '@talismn/ui'
import type { ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const Layout = () => (
  <div>
    <Tabs css={{ marginBottom: '5rem' }}>
      <NavLink to="/transfer/transport" css={{ display: 'contents' }}>
        {({ isActive }) => <Tabs.Item selected={isActive}>Transport</Tabs.Item>}
      </NavLink>
      <NavLink to="/transfer/swap" css={{ display: 'contents' }}>
        {({ isActive }) => <Tabs.Item selected={isActive}>Swap</Tabs.Item>}
      </NavLink>
    </Tabs>
    <Outlet />
  </div>
)

export default Layout

type FaqLayoutProps = {
  content: ReactNode
  faq: ReactNode
}

export const FaqLayout = (props: FaqLayoutProps) => (
  <div
    css={{
      display: 'flex',
      flexDirection: 'column',
      gap: '5rem',
      '@media(min-width: 768px)': {
        flexDirection: 'row',
        maxWidth: 1250,
        margin: 'auto',
      },
    }}
  >
    <TitlePortal>Transport</TitlePortal>
    <section css={{ flex: 1 }}>
      <ErrorBoundary>{props.content}</ErrorBoundary>
    </section>
    <section css={{ flex: 1 }}>{props.faq}</section>
  </div>
)
