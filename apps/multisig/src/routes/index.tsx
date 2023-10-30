import { createBrowserRouter } from 'react-router-dom'

import CreateMultisig from '../layouts/CreateMultisig'
import Landing from '../layouts/Landing'
import Overview from '../layouts/Overview'
import Settings from '../layouts/Settings'
import RequireAuth from '../layouts/Auth/RequireAuth'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/create',
    element: (
      <RequireAuth requireSignIn>
        <CreateMultisig />
      </RequireAuth>
    ),
  },
  {
    path: '/overview/*',
    element: (
      <RequireAuth requireMultisig requireSignIn>
        <Overview />
      </RequireAuth>
    ),
  },
  {
    path: '/settings/*',
    element: (
      <RequireAuth requireMultisig requireSignIn>
        <Settings />
      </RequireAuth>
    ),
  },
])

export default router
