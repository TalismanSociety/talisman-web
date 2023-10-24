import { createBrowserRouter } from 'react-router-dom'

import CreateMultisig from '../layouts/CreateMultisig'
import Landing from '../layouts/Landing'
import Overview from '../layouts/Overview'
import Settings from '../layouts/Settings'
import RequireAuth from '../layouts/Auth/RequireAuth'
import { AddressBook } from '../layouts/AddressBook'
import Send from '../layouts/NewTransaction/Send'
import MultiSend from '../layouts/NewTransaction/Multisend'

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
    path: '/send',
    element: (
      <RequireAuth requireMultisig requireSignIn>
        <Send />
      </RequireAuth>
    ),
  },
  {
    path: '/multisend',
    element: (
      <RequireAuth requireMultisig requireSignIn>
        <MultiSend />
      </RequireAuth>
    ),
  },
  {
    path: '/address-book',
    element: (
      <RequireAuth requireMultisig requireSignIn>
        <AddressBook />
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
