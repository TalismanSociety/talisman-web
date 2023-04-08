import * as React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import CreateMultisig from '../layouts/CreateMultisig'
import Landing from '../layouts/Landing'
import Overview from '../layouts/Overview'

const router = createBrowserRouter([
  {
    path: '/create',
    element: <CreateMultisig />,
  },
  {
    path: '/landing',
    element: <Landing />,
  },
  {
    path: '/',
    element: <Overview />,
  },
])

export default router
