import AssetItem from './item'
import Assets from './main'
import type { RouteObject } from 'react-router-dom'

const routes = {
  children: [
    { path: '', element: <Assets /> },
    { path: ':assetId', element: <AssetItem /> },
  ],
} satisfies RouteObject

export default routes
