import { createBrowserRouter } from 'react-router-dom'

import CreateMultisig from '../layouts/CreateMultisig'
import Import from '../layouts/Import'
import Landing from '../layouts/Landing'
import Overview from '../layouts/Overview'
import Settings from '../layouts/Settings'
import RequireExtension from '../layouts/Auth/RequireExtension'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/create',
    element: (
      <RequireExtension>
        <CreateMultisig />
      </RequireExtension>
    ),
  },
  {
    path: '/overview/*',
    element: (
      <RequireExtension requireMultisig>
        <Overview />
      </RequireExtension>
    ),
  },
  {
    path: '/settings/*',
    element: (
      <RequireExtension requireMultisig>
        <Settings />
      </RequireExtension>
    ),
  },
  {
    path: '/import',
    element: <Import />,
  },
])

export default router
