// @ts-nocheck

import { BalanceConfigBuilder, ContractConfig, SubstrateQueryConfig } from '@galacticcouncil/xcm-core'
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
    build: ({ address, asset }) => {
      if (!asset || !isString(asset)) {
        throw new Error(`Invalid contract address: ${asset}`)
      }

      return new ContractConfig({
        address: asset,
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
      build: ({ address, asset }) =>
        new SubstrateQueryConfig({
          module: 'assets',
          func: 'account',
          args: [asset, address],
          transform: async (response: Option<PalletAssetsAssetAccount>): Promise<bigint> =>
            response.unwrapOrDefault().balance.toBigInt(),
        }),
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
      build: ({ address, asset }) =>
        new SubstrateQueryConfig({
          module: 'tokens',
          func: 'accounts',
          args: [address, asset],
          transform: async ({ free, frozen }: OrmlTokensAccountData): Promise<bigint> =>
            BigInt(free.sub(frozen).toString()),
        }),
    }),
  }
}

function ormlTokens() {
  return {
    accounts: (): BalanceConfigBuilder => ({
      build: ({ address, asset }) =>
        new SubstrateQueryConfig({
          module: 'ormlTokens',
          func: 'accounts',
          args: [address, asset],
          transform: async ({ free, frozen }: OrmlTokensAccountData): Promise<bigint> =>
            BigInt(free.sub(frozen).toString()),
        }),
    }),
  }
}
