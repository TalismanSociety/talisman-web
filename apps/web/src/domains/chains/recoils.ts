import { SubstrateApiContext, substrateApiState } from '@domains/common'
import { storageEffect } from '@domains/common/effects'
import { BN } from '@polkadot/util'
import { ToBn } from '@polkadot/util/types'
import Decimal from '@util/Decimal'
import { useContext } from 'react'
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
    get: ({ get }) => get(chainState).rpcs[0]?.url ?? '',
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

export const tokenPriceState = selectorFamily({
  key: 'TokenPrice',
  get:
    ({ coingeckoId, fiat }: { coingeckoId: string; fiat: string }) =>
    async () => {
      try {
        const result = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=${fiat}`
        ).then(x => x.json())

        return result[coingeckoId][fiat] as number
      } catch {
        // Coingecko has rate limit, better to return 0 than to crash the session
        // TODO: find alternative or purchase Coingecko subscription
        return 0
      }
    },
})

export const nativeTokenPriceState = selectorFamily({
  key: 'NativeTokenPrice',
  get:
    (fiat: string = 'usd') =>
    async ({ get }) => {
      const chain = get(chainState)

      if (chain.isTestnet) return 1

      if (chain.nativeToken.coingeckoId === undefined) {
        return 0
      }

      return get(tokenPriceState({ coingeckoId: chain.nativeToken.coingeckoId, fiat }))
    },
})

export const nativeTokenDecimalState = selectorFamily({
  key: 'NativeTokenDecimal',
  get:
    (apiEndpoint: string) =>
    ({ get }) => {
      const api = get(substrateApiState(apiEndpoint))
      return {
        fromPlanck: (value: string | number | bigint | BN | ToBn | undefined) =>
          Decimal.fromPlanck(value, api.registry.chainDecimals[0] ?? 0, api.registry.chainTokens[0] ?? ''),
        fromUserInput: (input: string) =>
          Decimal.fromUserInput(input, api.registry.chainDecimals[0] ?? 0, api.registry.chainTokens[0] ?? ''),
      }
    },
})

export const useNativeTokenDecimalState = () => nativeTokenDecimalState(useContext(SubstrateApiContext).endpoint)
