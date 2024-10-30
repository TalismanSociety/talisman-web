import { AnyChain, ChainAssetData } from '@galacticcouncil/xcm-core'

import { talismanRoutes, TalismanRoutesContext } from './talismanRoutes'

/**
 * Inserts `talismanRoutes` into the default routes from `@galacticcouncil/xcm-cfg`,
 * but first does a series of validations to notify the developer about common misconfigurations.
 */
export function insertTalismanRoutes({ assets, chains, routes }: TalismanRoutesContext) {
  class ValidationError extends Error {}

  for (const talismanRoute of talismanRoutes) {
    try {
      const route = talismanRoute({ assets, chains, routes })
      if (!route) continue // ignore invalid routes which have already logged their misconfiguration to the console

      const asset = assets.get(route.assetKey)
      if (!asset) throw new ValidationError(`Missing asset ${route.assetKey} in XCM config`)

      const validateChain = (chainKey: string) => {
        const chain = chains.get(chainKey)
        const chainRoutes = routes.get(chainKey)
        if (!chain) throw new ValidationError(`Missing chain ${chainKey} in XCM config`)
        if (!chainRoutes) throw new ValidationError(`Missing routes for chain ${chainKey} in XCM config`)
        return [chain, chainRoutes] as const
      }
      const [aChain, aChainRoutes] = validateChain(route.aChainKey)
      const [bChain, bChainRoutes] = validateChain(route.bChainKey)

      const validateAssetData = (chain: AnyChain, assetKey: string, assetData?: ChainAssetData) => {
        if (!chain.assetsData.has(assetKey)) {
          if (!assetData) throw new ValidationError(`Missing chainAssetData for ${chain.key}:${assetKey} in XCM config`)

          // insert talisman-provided assetData for this chain
          chain.assetsData.set(assetKey, assetData)
        }
      }
      validateAssetData(aChain, route.assetKey, route.aAssetData)
      validateAssetData(bChain, route.assetKey, route.bAssetData)

      aChainRoutes.routes.set(`${route.assetKey}-${route.bChainKey}`, route.aRoute)
      bChainRoutes.routes.set(`${route.assetKey}-${route.aChainKey}`, route.bRoute)
    } catch (error) {
      if (!(error instanceof ValidationError)) throw error

      // print warning and exclude this (invalid) route
      console.warn(error.message)
      continue
    }
  }
}
