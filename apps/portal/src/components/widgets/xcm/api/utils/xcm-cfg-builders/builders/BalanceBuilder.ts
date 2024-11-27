// @ts-nocheck

import { Abi, BalanceConfigBuilder, ContractConfig, Parachain, SubstrateQueryConfig } from '@galacticcouncil/xcm-core'
import { Option } from '@polkadot/types'
import {
  FrameSystemAccountInfo,
  OrmlTokensAccountData,
  PalletAssetsAssetAccount,
  PalletBalancesAccountData,
} from '@polkadot/types/lookup'
import { isString } from '@polkadot/util'

export function BalanceBuilder() {
  return {
    substrate,
    evm,
  }
}

export function substrate() {
  return {
    assets,
    system,
    tokens,
    ormlTokens,
    foreignAssets,
  }
}

export function evm() {
  return {
    erc20,
    native,
  }
}

function native(): BalanceConfigBuilder {
  return {
    build: ({ address }) => {
      return new ContractConfig({
        abi: [],
        address: address,
        args: [],
        func: 'eth_getBalance',
        module: 'Native',
      })
    },
  }
}

function erc20(): BalanceConfigBuilder {
  return {
    build: ({ address, asset, chain }) => {
      const assetId = chain.getBalanceAssetId(asset)
      if (!assetId || !isString(assetId)) {
        throw new Error(`Invalid contract address: ${asset}`)
      }

      return new ContractConfig({
        abi: Abi.Erc20,
        address: assetId,
        args: [address],
        func: 'balanceOf',
        module: 'Erc20',
      })
    },
  }
}

function assets() {
  return {
    account: (): BalanceConfigBuilder => ({
      build: ({ address, asset, chain }) => {
        const assetId = chain.getBalanceAssetId(asset)
        return new SubstrateQueryConfig({
          module: 'assets',
          func: 'account',
          args: [assetId, address],
          transform: async (response: Option<PalletAssetsAssetAccount>): Promise<bigint> =>
            response.unwrapOrDefault().balance.toBigInt(),
        })
      },
    }),
  }
}

function foreignAssets() {
  return {
    account: (): BalanceConfigBuilder => ({
      build: ({ address, asset, chain }) => {
        const ctx = chain as Parachain

        const assetLocation = ctx.getAssetXcmLocation(asset)
        if (!assetLocation) {
          throw new Error('Missing asset xcm location for ' + asset.key)
        }

        return new SubstrateQueryConfig({
          module: 'foreignAssets',
          func: 'account',
          args: [assetLocation, address],
          transform: async (response: Option<PalletAssetsAssetAccount>): Promise<bigint> =>
            response.unwrapOrDefault().balance.toBigInt(),
        })
      },
    }),
  }
}

function system() {
  return {
    account: (): BalanceConfigBuilder => ({
      build: ({ address }) =>
        new SubstrateQueryConfig({
          module: 'system',
          func: 'account',
          args: [address],
          transform: async (response: FrameSystemAccountInfo): Promise<bigint> => {
            const balance = response.data as PalletBalancesAccountData
            // @ts-ignore
            const frozen = balance.miscFrozen ?? balance.frozen
            return BigInt(balance.free.sub(frozen).toString())
          },
        }),
    }),
  }
}

function tokens() {
  return {
    accounts: (): BalanceConfigBuilder => ({
      build: ({ address, asset, chain }) => {
        const assetId = chain.getBalanceAssetId(asset)
        return new SubstrateQueryConfig({
          module: 'tokens',
          func: 'accounts',
          args: [address, assetId],
          transform: async ({ free, frozen }: OrmlTokensAccountData): Promise<bigint> =>
            BigInt(free.sub(frozen).toString()),
        })
      },
    }),
  }
}

function ormlTokens() {
  return {
    accounts: (): BalanceConfigBuilder => ({
      build: ({ address, asset, chain }) => {
        const assetId = chain.getBalanceAssetId(asset)
        return new SubstrateQueryConfig({
          module: 'ormlTokens',
          func: 'accounts',
          args: [address, assetId],
          transform: async ({ free, frozen }: OrmlTokensAccountData): Promise<bigint> =>
            BigInt(free.sub(frozen).toString()),
        })
      },
    }),
  }
}

/* function foreignAssets(parachain: Parachain) {
  return {
    account: () => {
      return {
        X1: (): BalanceConfigBuilder => ({
          build: ({ address }) =>
            new SubstrateQueryConfig({
              module: 'foreignAssets',
              func: 'account',
              args: [
                {
                  X1: [
                    {
                      Parachain: parachain.parachainId,
                    },
                  ],
                },
                address,
              ],
              transform: async (
                response: Option<PalletAssetsAssetAccount>
              ): Promise<bigint> =>
                response.unwrapOrDefault().balance.toBigInt(),
            }),
        }),
        X2: (): BalanceConfigBuilder => ({
          build: ({ address, asset }) => {
            const assetData = parachain.findAssetById(asset.toString());
            return new SubstrateQueryConfig({
              module: 'foreignAssets',
              func: 'account',
              args: [
                {
                  X2: [
                    {
                      Parachain: parachain.parachainId,
                    },
                    {
                      PalletInstance: assetData?.palletInstance,
                    },
                  ],
                },
                address,
              ],
              transform: async (
                response: Option<PalletAssetsAssetAccount>
              ): Promise<bigint> =>
                response.unwrapOrDefault().balance.toBigInt(),
            });
          },
        }),
      };
    },
  };
}
 */
