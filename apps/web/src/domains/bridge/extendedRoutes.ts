import type { ChainId } from '@polkawallet/bridge'
import { AssetHubPolkadotAdapter } from '@polkawallet/bridge/adapters/assethub'
import { CentrifugeAdapter } from '@polkawallet/bridge/adapters/centrifuge'
import { ParallelAdapter } from '@polkawallet/bridge/adapters/parallel'
import type { BaseCrossChainAdapter } from '@polkawallet/bridge/base-chain-adapter'
import type BN from 'bn.js'

type RouteConfig = {
  to: ChainId
  token: string
  xcm: {
    fee: { token: string; amount: string }
    weightLimit: string
  }
}

type TokenConfig = {
  name: string
  symbol: string
  decimals: number
  ed: string
  toRaw: () => BN | number | string
}

type ExtendedAdapter<T extends new (...args: any[]) => BaseCrossChainAdapter> = new () => InstanceType<T> &
  BaseCrossChainAdapter

function extendAdapter<T extends typeof AssetHubPolkadotAdapter | typeof ParallelAdapter | typeof CentrifugeAdapter>(
  AdapterClass: T,
  additionalRoutes: RouteConfig[],
  additionalTokens: Record<string, TokenConfig>
): ExtendedAdapter<T> {
  return class ExtendedAdapter extends AdapterClass {
    constructor() {
      super()
      this.addRouters()
      this.addTokens()
    }

    addRouters() {
      // TODO: check for additionalRoutes already existing. If so, don't add.
      // @ts-expect-error
      const existingRoutes = this.routers ?? []
      Object.assign(this, { routers: [...existingRoutes, ...additionalRoutes] })
    }

    addTokens() {
      // TODO: check for additionalTokens already existing. If so, don't add.
      // @ts-expect-error
      const existingTokens = this.tokens ?? {}
      Object.assign(this, { tokens: { ...existingTokens, ...additionalTokens } })
    }
  } as unknown as ExtendedAdapter<T>
}

const newAssetHubPolkadotRoutes: RouteConfig[] = [
  {
    to: 'parallel',
    token: 'USDT',
    xcm: {
      fee: { token: 'USDT', amount: '4000' },
      weightLimit: 'Unlimited',
    },
  },
  {
    to: 'centrifuge',
    token: 'USDC',
    xcm: {
      fee: { token: 'USDC', amount: '4000' },
      weightLimit: 'Unlimited',
    },
  },
]

const newAssetHubPolkadotTokens: Record<string, TokenConfig> = {
  // https://github.com/polkawallet-io/bridge/pull/124
  DOT: {
    name: 'DOT',
    symbol: 'DOT',
    decimals: 10,
    ed: '100000000',
    toRaw: () => 'NATIVE',
  },
}

const newParallelRoutes: RouteConfig[] = [
  {
    to: 'assetHubPolkadot',
    token: 'USDT',
    xcm: {
      fee: { token: 'USDT', amount: '4000' },
      weightLimit: 'Unlimited',
    },
  },
]

const newParallelTokens: Record<string, TokenConfig> = {
  USDT: {
    name: 'USDT',
    symbol: 'USDT',
    decimals: 6,
    ed: '700000',
    toRaw: () => 102,
  },
}

const newCentrifugeTokens: Record<string, TokenConfig> = {
  USDC: {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    ed: '700000',
    toRaw: () => 'USDC',
  },
}

export const ExtendedAssetHubPolkadotAdapter = extendAdapter(
  AssetHubPolkadotAdapter,
  newAssetHubPolkadotRoutes,
  newAssetHubPolkadotTokens
)

export const ExtendedParallelAdapter = extendAdapter(ParallelAdapter, newParallelRoutes, newParallelTokens)

export const ExtendedCentrifugeAdapter = extendAdapter(CentrifugeAdapter, [], newCentrifugeTokens)
