import { createBrowserRouter } from 'react-router-dom'

import CreateMultisig from '../layouts/CreateMultisig'
import Import from '../layouts/Import'
import Landing from '../layouts/Landing'
import Overview from '../layouts/Overview'
import Settings from '../layouts/Settings'

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
    path: '/overview/*',
    element: <Overview />,
  },
  {
    path: '/settings/*',
    element: <Settings />,
  },
  {
    path: '/import',
    element: <Import />,
  },
])

export default router
