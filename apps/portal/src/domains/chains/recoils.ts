import type { RecoilValueReadOnly } from 'recoil'
import { chainsByGenesisHashAtom, tokensByIdAtom } from '@talismn/balances-react'
import { Chain } from '@talismn/chaindata-provider'
import { useContext } from 'react'
import { atom, selector, selectorFamily, waitForAll } from 'recoil'

import { selectedCurrencyState } from '@/domains/balances/currency'
import { storageEffect } from '@/domains/common/effects'
import { useSubstrateApiEndpoint } from '@/domains/common/hooks/useSubstrateApiEndpoint'
import { substrateApiState } from '@/domains/common/recoils/api'
import { Decimal } from '@/util/Decimal'
import { jotaiStore } from '@/util/jotaiStore'
import { nullToUndefined } from '@/util/nullToUndefined'

import { chainConfigs } from './config'
import { ChainContext } from './contexts'

export const chainState = selectorFamily({
  key: 'Chain',
  get:
    ({ genesisHash }: { genesisHash: string }) =>
    async () => {
      const chaindataChainsByGenesisHash = await jotaiStore.get(chainsByGenesisHashAtom)
      const chain = chaindataChainsByGenesisHash?.[genesisHash] as Chain
      const nativeToken = chain?.nativeToken ? (await jotaiStore.get(tokensByIdAtom))[chain.nativeToken.id] : undefined

      return nullToUndefined({
        ...chain,
        genesisHash: genesisHash as `0x${string}`,
        nativeToken,
        rpc: chain?.rpcs?.at(0)?.url,
        ...chainConfigs.find(config => config.genesisHash === chain?.genesisHash),
      })
    },
})

export type ChainInfo = ReturnType<typeof chainState> extends RecoilValueReadOnly<infer R> ? R : never

export const _chainsState = selector({
  key: '_Chains',
  get: ({ get }) => get(waitForAll(chainConfigs.map(({ genesisHash }) => chainState({ genesisHash })))),
})

export const enableTestnetsState = atom({
  key: 'EnableTestnets',
  default: false,
  effects: [storageEffect(sessionStorage)],
})

export const chainsState = selector({
  key: 'Chains',
  get: ({ get }) => (get(enableTestnetsState) ? get(_chainsState) : get(_chainsState).filter(x => !x.isTestnet)),
})

export const nominationPoolsEnabledChainsState = selector({
  key: 'NominationPoolsEnabledChains',
  get: ({ get }) =>
    get(chainsState).filter(
      (x): x is Extract<typeof x, { hasNominationPools: true }> => 'hasNominationPools' in x && x.hasNominationPools
    ),
})

export const dappStakingEnabledChainsState = selector({
  key: 'DappStakingEnabledChains',
  get: ({ get }) =>
    get(chainsState).filter(
      (x): x is Extract<typeof x, { hasDappStaking: true }> => 'hasDappStaking' in x && x.hasDappStaking
    ),
})

export const subtensorStakingEnabledChainsState = selector({
  key: 'SubtensorStakingEnabledChains',
  get: ({ get }) =>
    get(chainsState).filter(
      (x): x is Extract<typeof x, { hasSubtensorStaking: true }> => 'hasSubtensorStaking' in x && x.hasSubtensorStaking
    ),
})

export const tokenPriceState = selectorFamily({
  key: 'TokenPrice',
  get:
    ({ coingeckoId, ...params }: { coingeckoId: string; currency?: string }) =>
    async ({ get }) => {
      const currency = params.currency ?? get(selectedCurrencyState)
      try {
        const url = new URL('/api/v3/simple/price', import.meta.env.VITE_COIN_GECKO_API)
        url.searchParams.set('ids', coingeckoId)
        url.searchParams.set('vs_currencies', currency)

        const result = await fetch(url, {
          headers:
            import.meta.env.VITE_COIN_GECKO_API_KEY === undefined
              ? undefined
              : import.meta.env.VITE_COIN_GECKO_API_TIER === 'pro'
              ? { 'x-cg-pro-api-key': import.meta.env.VITE_COIN_GECKO_API_KEY }
              : import.meta.env.VITE_COIN_GECKO_API_TIER === 'demo'
              ? { 'x-cg-demo-api-key': import.meta.env.VITE_COIN_GECKO_API_KEY }
              : undefined,
        }).then(async x => await x.json())

        return result[coingeckoId][currency] as number
      } catch {
        return 0
      }
    },
})

export const nativeTokenPriceState = selectorFamily({
  key: 'NativeTokenPrice',
  get:
    ({ genesisHash, currency }: { genesisHash: string; currency?: string }) =>
    async ({ get }) => {
      const chain = get(chainState({ genesisHash }))
      if (chain.isTestnet) {
        return 0
      }

      const coingeckoId = chain.nativeToken?.coingeckoId

      if (coingeckoId === undefined) {
        console.error('Chain missing CoinGecko id')
        return 0
      }

      return get(tokenPriceState({ coingeckoId, currency })) || 0
    },
})

export const useNativeTokenPriceState = (currency?: string) =>
  nativeTokenPriceState({ genesisHash: useContext(ChainContext).genesisHash, currency })

export const nativeTokenDecimalState = selectorFamily({
  key: 'NativeTokenDecimal',
  get:
    (apiEndpoint: string) =>
    ({ get }) => {
      const api = get(substrateApiState(apiEndpoint))
      return {
        fromPlanck: (value: string | number | bigint) =>
          Decimal.fromPlanck(value, api.registry.chainDecimals[0] ?? 0, { currency: api.registry.chainTokens[0] }),
        fromPlanckOrUndefined: (value: string | number | bigint | undefined, symbol?: string) =>
          Decimal.fromPlanckOrUndefined(value, api.registry.chainDecimals[0] ?? 0, {
            currency: symbol ?? api.registry.chainTokens[0],
          }),
        fromUserInput: (input: string) =>
          Decimal.fromUserInput(input, api.registry.chainDecimals[0] ?? 0, { currency: api.registry.chainTokens[0] }),
        fromUserInputOrUndefined: (input: string) =>
          Decimal.fromUserInputOrUndefined(input, api.registry.chainDecimals[0] ?? 0, {
            currency: api.registry.chainTokens[0],
          }),
      }
    },
})

export const useNativeTokenDecimalState = () => nativeTokenDecimalState(useSubstrateApiEndpoint())

export const nativeTokenAmountState = selectorFamily({
  key: 'NativeTokenAmount',
  get:
    (params: { apiEndpoint: string; genesisHash: string }) =>
    ({ get }) => {
      const [decimal, price, currency] = get(
        waitForAll([
          nativeTokenDecimalState(params.apiEndpoint),
          nativeTokenPriceState({ genesisHash: params.genesisHash }),
          selectedCurrencyState,
        ])
      )

      const fromValue =
        <T, T1 extends Decimal | undefined>(transformFn: (value: T, symbol?: string) => T1) =>
        (value: T, symbol?: string) => {
          const decimalAmount = transformFn(value, symbol)
          const fiatAmount = (decimalAmount?.toNumber() ?? 0) * price
          const localizedFiatAmount = fiatAmount.toLocaleString(undefined, {
            style: 'currency',
            currency,
          })

          return {
            decimalAmount,
            fiatAmount,
            localizedFiatAmount,
          }
        }

      return {
        fromPlanck: fromValue(decimal.fromPlanck),
        fromPlanckOrUndefined: fromValue(decimal.fromPlanckOrUndefined),
        fromUserInput: fromValue(decimal.fromUserInput),
        fromUserInputOrUndefined: fromValue(decimal.fromUserInputOrUndefined),
      }
    },
})

export const useNativeTokenAmountState = () =>
  nativeTokenAmountState({ apiEndpoint: useSubstrateApiEndpoint(), genesisHash: useContext(ChainContext).genesisHash })
