import { createBrowserRouter } from 'react-router-dom'

import CreateMultisig from '../layouts/CreateMultisig'
import Landing from '../layouts/Landing'
import Overview from '../layouts/Overview'
import Settings from '../layouts/Settings'
import RequireAuth from '../layouts/Auth/RequireAuth'
import { AddressBook } from '../layouts/AddressBook'

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
      <RequireAuth requireSignIn>
        <Overview />
      </RequireAuth>
    ),
  },
  {
    path: '/address-book',
    element: (
      <RequireAuth requireSignIn>
        <AddressBook />
      </RequireAuth>
    ),
  },
  {
    path: '/settings/*',
    element: (
      <RequireAuth requireSignIn>
        <Settings />
      </RequireAuth>
    ),
  },
])

export default router
