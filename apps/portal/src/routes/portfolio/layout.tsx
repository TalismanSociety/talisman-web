import { Tabs } from '@talismn/ui/molecules/Tabs'
import { Outlet } from 'react-router'
import { Link, useMatch } from 'react-router-dom'

import ErrorBoundary from '@/components/widgets/ErrorBoundary'

const Layout = () => {
  // useMatch
  const paths = [
    { path: '', name: 'Overview' },
    { path: 'collectibles', name: 'Collectibles' },
  ]

  // get the current path that is after /portfolio/ even if there is something after it
  const currentPath = useMatch('/portfolio/:id/*')?.params.id ?? paths[0]?.path

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        width: '100%',
      }}
    >
      <Tabs>
        {paths.map(path => (
          <Tabs.Item key={path.path} as={Link} to={path.path} selected={path.path === currentPath}>
            {path.name}
          </Tabs.Item>
        ))}
      </Tabs>
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  )
}

export default Layout
