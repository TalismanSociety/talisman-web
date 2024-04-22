import ErrorBoundary from '@components/widgets/ErrorBoundary'
import { TitlePortal } from '@routes/layout'
import { Tabs } from '@talismn/ui'
import type { ReactNode } from 'react'
import { Link, Outlet } from 'react-router-dom'

const Layout = () => (
  <div>
    <Tabs css={{ marginBottom: '5rem' }}>
      <Tabs.Item as={Link} to="/transfer/transport">
        Transport
      </Tabs.Item>
      <Tabs.Item as={Link} to="/transfer/swap">
        Swap
      </Tabs.Item>
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
