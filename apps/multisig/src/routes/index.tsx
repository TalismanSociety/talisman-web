import * as React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import Landing from '../layouts/Landing'
import Overview from '../layouts/Overview'

const router = createBrowserRouter([
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
