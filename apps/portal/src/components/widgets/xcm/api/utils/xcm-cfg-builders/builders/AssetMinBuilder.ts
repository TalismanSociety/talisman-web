// @ts-nocheck
/* eslint-disable */

import { MinConfigBuilder, SubstrateQueryConfig } from '@galacticcouncil/xcm-core'
import { Option } from '@polkadot/types'
import { PalletAssetsAssetDetails } from '@polkadot/types/lookup'

export function AssetMinBuilder() {
  return {
    assetRegistry,
    assets,
  }
}

function assetRegistry() {
  const pallet = 'assetRegistry'
  return {
    assetMetadatas: (): MinConfigBuilder => ({
      build: ({ asset }) =>
        new SubstrateQueryConfig({
          module: pallet,
          func: 'assetMetadatas',
          args: [asset],
          transform: async (response: Option<any>): Promise<bigint> =>
            response.unwrapOrDefault().minimalBalance.toBigInt(),
        }),
    }),
    currencyMetadatas: (): MinConfigBuilder => ({
      build: ({ asset }) =>
        new SubstrateQueryConfig({
          module: pallet,
          func: 'currencyMetadatas',
          args: [asset],
          transform: async (response: Option<any>): Promise<bigint> =>
            response.unwrapOrDefault().minimalBalance.toBigInt(),
        }),
    }),
  }
}

function assets() {
  return {
    asset: (): MinConfigBuilder => ({
      build: ({ asset }) =>
        new SubstrateQueryConfig({
          module: 'assets',
          func: 'asset',
          args: [asset],
          transform: async (response: Option<PalletAssetsAssetDetails>): Promise<bigint> =>
            response.unwrapOrDefault().minBalance.toBigInt(),
        }),
    }),
  }
}
