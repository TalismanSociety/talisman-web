import { storageEffect } from '@domains/common/effects'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { BN } from '@polkadot/util'
import { ToBn } from '@polkadot/util/types'
import Decimal from '@util/Decimal'
import { atom, selector, selectorFamily } from 'recoil'

import { chains } from './config'
import { ChainId, chainParams, defaultParams } from './consts'

// Getting these value locally right now since chaindata squid is not too stable
export const chainsState = selector({
  key: 'Chains',
  get: () =>
    chains.map(x => ({
      ...x,
      params: chainParams[x.id as ChainId] ?? defaultParams,
    })),
})

export const chainIdState = atom<ChainId>({
  key: 'ChainId',
  default: 'polkadot',
  effects: [storageEffect(sessionStorage)],
})

export const chainRpcState = atom({
  key: 'ChainRpc',
  default: selector({
    key: 'ChainRpc/Default',
    get: ({ get }) => get(chainState).rpcs[0]?.url,
  }),
})

export const chainState = selector({
  key: 'Chain',
  get: ({ get }) => {
    const allChains = get(chainsState)
    const id = get(chainIdState)
    const chain = allChains.find(x => x.id === id)

    if (chain === undefined) throw new Error(`Can't find chain with id: ${id}`)

    return chain
  },
})

export const nativeTokenPriceState = selectorFamily({
  key: 'NativeTokenPrice',
  get:
    (fiat: string = 'usd') =>
    async ({ get }) => {
      const chain = get(chainState)

      if (chain.isTestnet) return 1

      try {
        if (chain.nativeToken.coingeckoId === undefined) {
          return 0
        }

        const result = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${chain.nativeToken.coingeckoId}&vs_currencies=${fiat}`
        ).then(x => x.json())

        return result[chain.nativeToken.coingeckoId][fiat] as number
      } catch {
        // Coingecko has rate limit, better to return 0 than to crash the session
        // TODO: find alternative or purchase Coingecko subscription
        return 0
      }
    },
})

export const apiState = selector({
  key: 'PolkadotApi',
  get: async ({ get }) => {
    const wsProvider = new WsProvider(get(chainRpcState))
    return ApiPromise.create({ provider: wsProvider })
  },
  dangerouslyAllowMutability: true,
})

// TODO: this hasn't been thought through, right now is a dirty hack for concurrent chain access
// need to rethink how we want to tackle this
export const chainApiState = selectorFamily({
  key: 'ChainApi',
  get:
    (id: ChainId) =>
    ({ get }) => {
      const allChains = get(chainsState)
      const chain = allChains.find(x => x.id === id)

      if (chain === undefined) {
        throw new Error(`Can't find chain with id: ${id}`)
      }

      return ApiPromise.create({
        provider: new WsProvider(chain.rpcs[0]?.url),
      })
    },
  dangerouslyAllowMutability: true,
})

export const nativeTokenDecimalState = selector({
  key: 'NativeTokenDecimal',
  get: ({ get }) => {
    const api = get(apiState)
    return {
      fromPlanck: (value: string | number | bigint | BN | ToBn | undefined) =>
        Decimal.fromPlanck(value, api.registry.chainDecimals[0] ?? 0, api.registry.chainTokens[0] ?? ''),
      fromUserInput: (input: string) =>
        Decimal.fromUserInput(input, api.registry.chainDecimals[0] ?? 0, api.registry.chainTokens[0] ?? ''),
    }
  },
})
