import type { RouteObject } from 'react-router-dom'
import AssetItem from './item'
import Assets from './main'

const routes = {
  children: [
    { path: '', element: <Assets /> },
    { path: ':assetId', element: <AssetItem /> },
  ],
} satisfies RouteObject

export default routes
