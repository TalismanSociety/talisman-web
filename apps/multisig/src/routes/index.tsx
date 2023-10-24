import { createBrowserRouter } from 'react-router-dom'

import Landing from '../layouts/Landing'
import Overview from '../layouts/Overview'
import Settings from '../layouts/Settings'
import RequireAuth from '../layouts/Auth/RequireAuth'
import Send from '../layouts/NewTransaction/Send'
import { AddressBook } from '../layouts/AddressBook'
import { AddVault } from '../layouts/AddVault'
import MultiSend from '../layouts/NewTransaction/Multisend'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/add-vault/*',
    element: (
      <RequireAuth requireSignIn>
        <AddVault />
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
    path: '/send',
    element: (
      <RequireAuth requireSignIn>
        <Send />
      </RequireAuth>
    ),
  },
  {
    path: '/multisend',
    element: (
      <RequireAuth requireSignIn>
        <MultiSend />
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
