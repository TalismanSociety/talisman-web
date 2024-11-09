import {
  AnyChain,
  Asset,
  AssetRoute,
  ChainAssetData,
  ChainRoutes,
  SubstrateQueryConfig,
} from '@galacticcouncil/xcm-core'
import { Option } from '@polkadot/types-codec'

import {
  AssetMinBuilder,
  BalanceBuilder,
  // BalanceBuilderSubstrateForeignAssets,
  ExtrinsicBuilder,
  // ForeignAssetsMinBuilder,
} from './xcm-cfg-builders'

const assetHubXcmDeliveryFee = 0.036

/**
 * Several routes are included by default in `@galacticcouncil/xcm-cfg`, but this array extends the default routes
 * with some extra Talisman-defined ones.
 */
export const talismanRoutes: Array<(ctx: TalismanRoutesContext) => TalismanRoute | undefined> = [
  withHelpers(({ getAsset, getChain }) => {
    const assetKey = 'usdc'
    const aChainKey = 'assethub'
    const bChainKey = 'centrifuge'

    const dot = getAsset('dot')
    const cfg = getAsset('cfg')
    const usdc = getAsset(assetKey)
    const assethub = getChain(aChainKey)
    const centrifuge = getChain(bChainKey)

    return {
      assetKey,
      aChainKey,
      bChainKey,

      aRoute: new AssetRoute({
        source: {
          asset: usdc,
          balance: BalanceBuilder().substrate().assets().account(),
          fee: {
            asset: dot,
            balance: BalanceBuilder().substrate().system().account(),
            extra: assetHubXcmDeliveryFee,
          },
          destinationFee: {
            balance: BalanceBuilder().substrate().assets().account(),
          },
          min: AssetMinBuilder().assets().asset(),
        },
        destination: {
          chain: centrifuge,
          asset: usdc,
          fee: {
            amount: 0.004,
            asset: usdc,
          },
        },
        extrinsic: ExtrinsicBuilder().polkadotXcm().limitedReserveTransferAssets().X2(),
      }),
      bRoute: new AssetRoute({
        source: {
          asset: usdc,
          balance: BalanceBuilder().substrate().ormlTokens().accounts(),
          fee: {
            asset: cfg,
            balance: BalanceBuilder().substrate().system().account(),
            // TODO: Get cfg delivery fee
            // extra: assetHubXcmDeliveryFee,
          },
          destinationFee: {
            balance: BalanceBuilder().substrate().ormlTokens().accounts(),
          },
          min: {
            build: ({ asset }) =>
              new SubstrateQueryConfig({
                module: 'ormlAssetRegistry',
                func: 'metadata',
                args: [asset],
                transform: async (response: Option<any>): Promise<bigint> =>
                  response.unwrapOrDefault().existentialDeposit.toBigInt(),
              }),
          },
        },
        destination: {
          chain: assethub,
          asset: usdc,
          fee: {
            amount: 0.014141,
            asset: usdc,
          },
        },
        extrinsic: ExtrinsicBuilder().xTokens().transfer(),
      }),
      bAssetData: {
        asset: usdc,
        decimals: 6,
        id: { ForeignAsset: 6 },
        metadataId: { ForeignAsset: 6 },
        min: 0.001,
      },
    }
  }),

  // withHelpers(({ getAsset, getChain }) => {
  //   const assetKey = 'myth'
  //   const aChainKey = 'assethub'
  //   const bChainKey = 'mythos'

  //   const myth = getAsset(assetKey)
  //   const assethub = getChain(aChainKey)
  //   const mythos = getChain(bChainKey)

  //   return {
  //     assetKey,
  //     aChainKey,
  //     bChainKey,

  //     // TODO: Fix AH -> Mythos route (needs to use ForeignAssets pallet for all interactions, instead of Assets pallet)
  //     aRoute: new AssetRoute({
  //       source: {
  //         asset: myth,
  //         balance: BalanceBuilderSubstrateForeignAssets().account(),
  //         destinationFee: {
  //           balance: BalanceBuilderSubstrateForeignAssets().account(),
  //         },
  //         min: ForeignAssetsMinBuilder().assets().asset(),
  //       },
  //       destination: {
  //         chain: mythos,
  //         asset: myth,
  //         // TODO: Find actual amount
  //         fee: {
  //           amount: 1,
  //           asset: myth,
  //         },
  //       },
  //       // extrinsic: ExtrinsicBuilder().polkadotXcm().limitedTeleportAssets(0).here(),
  //     }),
  //     aAssetData: {
  //       asset: myth,
  //       decimals: 18,
  //       id: { parents: 1, interior: { X1: { Parachain: 3369 } } },
  //       balanceId: { parents: 1, interior: { X1: { Parachain: 3369 } } },
  //       min: 0.01,
  //     },
  //     bRoute: new AssetRoute({
  //       source: {
  //         asset: myth,
  //         balance: BalanceBuilder().substrate().system().account(),
  //         destinationFee: {
  //           balance: BalanceBuilder().substrate().system().account(),
  //         },
  //       },
  //       destination: {
  //         chain: assethub,
  //         asset: myth,
  //         fee: {
  //           amount: 0.038,
  //           asset: myth,
  //         },
  //       },
  //       extrinsic: ExtrinsicBuilder().polkadotXcm().limitedTeleportAssets(0).here(),
  //     }),
  //   }
  // }),
]

export type TalismanRoute = {
  /** The key of the asset this route transfers. */
  assetKey: string
  /**
   * The key of the first chain in this route.
   * It doesn't matter which of the two chains is aChain or bChain,
   * it only matters that a or b is used consistently throughout this route config.
   */
  aChainKey: string
  /** The key of the second chain in this route. */
  bChainKey: string

  /** The route config for the aChain -> bChain route */
  aRoute: AssetRoute
  /** The route config for the bChain -> aChain route */
  bRoute: AssetRoute

  /**
   * The `assetKey` asset config for the chain with id `aChainKey`.
   * Is only used when `@galacticcouncil/xcm-cfg` doesn't already have an assetConfig for this asset on this chain.
   */
  aAssetData?: ChainAssetData
  /**
   * The `assetKey` asset config for the chain with id `bChainKey`.
   * Is only used when `@galacticcouncil/xcm-cfg` doesn't already have an assetConfig for this asset on this chain.
   */
  bAssetData?: ChainAssetData
}

/**
 * Used to access and extends the assets, chains and routes from `@galacticcouncil/xcm-cfg`.
 */
export type TalismanRoutesContext = {
  assets: Map<string, Asset>
  chains: Map<string, AnyChain>
  routes: Map<string, ChainRoutes>
}

/**
 * Helpers for accessing existing assets/chains from `@galacticcouncil/xcm-cfg`.
 *
 * They attempt to retrieve the asset or chain by key, but if it doesn't exist they will print
 * a warning to the console and exclude the route from the talismanRoutes config.
 */
function withHelpers(callback: (helpers: Helpers) => TalismanRoute) {
  class HelperError extends Error {}

  return (ctx: TalismanRoutesContext) => {
    try {
      const route = callback({
        getAsset: key => {
          const asset = ctx.assets.get(key)
          if (!asset) throw new HelperError(`Missing asset ${key} in XCM config`)
          return asset
        },
        getChain: key => {
          const chain = ctx.chains.get(key)
          if (!chain) throw new HelperError(`Missing chain ${key} in XCM config`)
          return chain
        },
      })

      return route
    } catch (error) {
      if (!(error instanceof HelperError)) throw error

      // print warning and exclude this (invalid) route
      return void console.error(error.message)
    }
  }
}
type Helpers = {
  getAsset: (key: string) => Asset
  getChain: (key: string) => AnyChain
}
