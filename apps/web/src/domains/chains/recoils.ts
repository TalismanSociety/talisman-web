import { selectedCurrencyState } from '@domains/balances'
import { substrateApiState, useSubstrateApiEndpoint } from '@domains/common'
import { type BN } from '@polkadot/util'
import { type ToBn } from '@polkadot/util/types'
import { Decimal } from '@talismn/math'
import { useContext } from 'react'
import { atom, selector, selectorFamily } from 'recoil'
import { ChainContext } from '.'
import { chains, type Chain } from './config'

export const _chainsState = atom({ key: '_Chains', default: chains })

export const enableTestnetsState = atom({ key: 'EnableTestnets', default: false })

export const chainsState = selector({
  key: 'Chains',
  get: ({ get }) => (get(enableTestnetsState) ? get(_chainsState) : get(_chainsState).filter(x => !x.isTestnet)),
})

export const tokenPriceState = selectorFamily({
  key: 'TokenPrice',
  get:
    ({ coingeckoId }: { coingeckoId: string }) =>
    async ({ get }) => {
      const currency = get(selectedCurrencyState)
      try {
        const result = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=${currency}`
        ).then(async x => await x.json())

        return result[coingeckoId][currency] as number
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
    ({ chain }: { chain: Chain }) =>
    async ({ get }) => {
      if (chain?.isTestnet) {
        return 0
      }

      const coingeckoId = chain.nativeToken.coingeckoId

      if (coingeckoId === undefined) {
        throw new Error('Chain missing CoinGecko id')
      }

      return get(tokenPriceState({ coingeckoId }))
    },
})

export const useNativeTokenPriceState = () => nativeTokenPriceState({ chain: useContext(ChainContext) })

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

export const useNativeTokenDecimalState = () => nativeTokenDecimalState(useSubstrateApiEndpoint())
