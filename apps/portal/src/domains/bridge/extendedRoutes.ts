import type { ChainId } from '@polkawallet/bridge'
import { AssetHubPolkadotAdapter } from '@polkawallet/bridge/adapters/assethub'
import { AstarAdapter } from '@polkawallet/bridge/adapters/astar'
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
  toQuery?: () => BN | number | string // required for astar balance adapter
}

type ExtendedAdapter<T extends new (...args: any[]) => BaseCrossChainAdapter> = new () => InstanceType<T> &
  BaseCrossChainAdapter

function extendAdapter<
  T extends typeof AssetHubPolkadotAdapter | typeof ParallelAdapter | typeof CentrifugeAdapter | typeof AstarAdapter
>(AdapterClass: T, additionalRoutes: RouteConfig[], additionalTokens: Record<string, TokenConfig>): ExtendedAdapter<T> {
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
  {
    to: 'astar',
    token: 'PINK',
    xcm: {
      fee: { token: 'PINK', amount: '80370000' },
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

const newAstarTokens: Record<string, TokenConfig> = {
  PINK: {
    name: 'PINK',
    symbol: 'PINK',
    decimals: 10,
    ed: '1',
    // TODO: get this value
    // for now it doesn't matter what toRaw is, as long as PINK is only received
    toRaw: () => '0x0000000000000000000000000000000000000000000000000000000000000000',
    toQuery: () => '18446744073709551633',
  },
}

export const ExtendedAssetHubPolkadotAdapter = extendAdapter(
  AssetHubPolkadotAdapter,
  newAssetHubPolkadotRoutes,
  newAssetHubPolkadotTokens
)

export const ExtendedParallelAdapter = extendAdapter(ParallelAdapter, newParallelRoutes, newParallelTokens)

export const ExtendedCentrifugeAdapter = extendAdapter(CentrifugeAdapter, [], newCentrifugeTokens)

export const ExtendedAstarAdapter = extendAdapter(AstarAdapter, [], newAstarTokens)
