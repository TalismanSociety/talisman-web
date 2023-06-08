import ErrorBoundary from '@components/widgets/ErrorBoundary'
import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => (
  <div css={{ paddingTop: '5rem' }}>
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
      'display': 'flex',
      'flexDirection': 'column',
      'gap': '5rem',
      '@media(min-width: 768px)': {
        flexDirection: 'row',
        maxWidth: 1250,
        margin: 'auto',
      },
    }}
  >
    <section css={{ flex: 1 }}>
      <ErrorBoundary>{props.content}</ErrorBoundary>
    </section>
    <section css={{ flex: 1 }}>{props.faq}</section>
  </div>
)
