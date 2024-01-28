import { StatemintAdapter } from '@polkawallet/bridge/adapters/statemint'
import { ParallelAdapter } from '@polkawallet/bridge/adapters/parallel'
import { CentrifugeAdapter } from '@polkawallet/bridge/adapters/centrifuge'

import BN from 'bn.js'

function createRouteConfigs(from, routes) {
  return routes.map(route => ({ ...route, from }))
}

function extendAdapter(AdapterClass, additionalRoutes, additionalTokens) {
  return class ExtendedAdapter extends AdapterClass {
    constructor() {
      super()
      this.addRouters()
      this.addTokens()
      console.log('balanceAdapter', this.balanceAdapter)
    }

    addRouters() {
      // TODO: check for additionalRoutes already existing. If so, don't add.
      const newRoutes = createRouteConfigs('statemint', additionalRoutes)
      const existingRoutes = this.routers || []
      this.routers = [...existingRoutes, ...newRoutes]
    }

    addTokens() {
      console.log('yeeeeet', this.tokens)
      // TODO: check for additionalTokens already existing. If so, don't add.
      const existingTokens = this.tokens || {}
      this.tokens = { ...existingTokens, ...additionalTokens }
      console.log('yeeeet2', this.tokens)
    }
  }
}

const newStatemintRoutes = [
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

const newStatemintTokens = {
  USDC: {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    ed: '700000',
    toRaw: () => new BN(1337),
  },
}

const newParallelRoutes = [
  {
    to: 'statemint',
    token: 'USDT',
    xcm: {
      fee: { token: 'USDT', amount: '4000' },
      weightLimit: 'Unlimited',
    },
  },
]

const newParallelTokens = {
  USDT: {
    name: 'USDT',
    symbol: 'USDT',
    decimals: 6,
    ed: '700000',
    toRaw: () => 102,
  },
}

const newCentrifugeTokens = {
  USDC: {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    ed: '700000',
    // toRaw: () => new BN(6),
    toRaw: () => 'USDC',
  },
}

const ExtendedStatemintAdapter = extendAdapter(StatemintAdapter, newStatemintRoutes, newStatemintTokens)
const ExtendedParallelAdapter = extendAdapter(ParallelAdapter, newParallelRoutes, newParallelTokens)
const ExtendedCentrifugeAdapter = extendAdapter(CentrifugeAdapter, [], newCentrifugeTokens)

export { ExtendedStatemintAdapter, ExtendedParallelAdapter, ExtendedCentrifugeAdapter }
