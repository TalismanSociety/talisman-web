import ErrorBoundary from '@components/widgets/ErrorBoundary'
import { Tab } from '@talismn/ui'
import { Outlet } from 'react-router'
import { Link, useMatch } from 'react-router-dom'

const Layout = () => {
  // useMatch
  const paths = [
    { path: '', name: 'Overview' },
    { path: 'collectibles', name: 'Collectibles' },
    { path: 'history', name: 'History' },
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
      <Tab>
        {paths.map(path => (
          <Tab.Item key={path.path} as={Link} to={path.path} selected={path.path === currentPath}>
            {path.name}
          </Tab.Item>
        ))}
      </Tab>
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  )
}

export default Layout
