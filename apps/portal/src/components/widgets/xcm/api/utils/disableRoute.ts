import { AssetRoute, ChainRoutes } from '@galacticcouncil/xcm-core'

/**
 * Deletes a route from `routes`, based on `sourceChainKey` and `routeKey`.
 */
export function disableRoute(routes: Map<string, ChainRoutes>, sourceChainKey: string, routeKey: string) {
  const chainRoutes = routes.get(sourceChainKey)?.routes
  if (!chainRoutes) return

  const route = chainRoutes.get(routeKey)
  if (!route) return

  chainRoutes.set(routeKey, new AssetRoute({ ...route, extrinsic: undefined }))
}
