import * as React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import CreateMultisig from '../layouts/CreateMultisig'
import Landing from '../layouts/Landing'
import Overview from '../layouts/Overview'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/create',
    element: <CreateMultisig />,
  },
  {
    path: '/overview',
    element: <Overview />,
  },
])

export default router
