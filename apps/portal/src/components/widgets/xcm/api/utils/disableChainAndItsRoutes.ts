import { AnyChain, ChainRoutes } from '@galacticcouncil/xcm-core'

/**
 * Deletes all routes from `routes` which match from/to the given `chainKey`.
 */
export function disableChainAndItsRoutes(
  chains: Map<string, AnyChain>,
  chainsRoutes: Map<string, ChainRoutes>,
  chainKey: string
) {
  // delete chain
  chains.delete(chainKey)

  // delete source routes
  chainsRoutes.delete(chainKey)

  // delete dest routes
  chainsRoutes.forEach(chainRoutes =>
    chainRoutes.routes.forEach(
      // delete if destination key is chainKey
      (assetRoute, key) => assetRoute.destination.chain.key === chainKey && chainRoutes.routes.delete(key)
    )
  )
}
