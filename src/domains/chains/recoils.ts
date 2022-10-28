import { ApiPromise, WsProvider } from '@polkadot/api'
import { BN } from '@polkadot/util'
import { ToBn } from '@polkadot/util/types'
import Decimal from '@util/Decimal'
import { gql, request } from 'graphql-request'
import { atom, selector, selectorFamily } from 'recoil'

export type Chain = {
  id: string
  rpcs: Array<{ url: string }>
  isTestnet: boolean
  nativeToken: {
    data: {
      symbol: string
      decimals: number
      coingeckoId: string
    }
  }
  subscanUrl: string | null
}

const SUPPORTED_CHAIN_IDS = ['polkadot', 'kusama', 'westend-testnet']

export const chainsState = selector({
  key: 'Chains',
  get: async () => {
    const response = await request<{ chains: Chain[] }>(
      'https://app.gc.subsquid.io/beta/chaindata/v3/graphql',
      gql`
        query getChains($ids: [String!]!) {
          chains(where: { id_in: $ids }) {
            id
            isTestnet
            rpcs {
              url
            }
            nativeToken {
              data
            }
            subscanUrl
          }
        }
      `,
      { ids: SUPPORTED_CHAIN_IDS }
    )

    return response.chains
  },
})

export const currentChainIdState = atom({
  key: 'CurrentChainId',
  default: sessionStorage.getItem('currentChainId') ?? SUPPORTED_CHAIN_IDS[0],
})

export const currentChainState = selector({
  key: 'CurrentChain',
  get: ({ get }) => {
    const allChains = get(chainsState)
    const id = get(currentChainIdState)
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
      const chain = get(currentChainState)

      if (chain.isTestnet) return 1

      try {
        const result = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${chain.nativeToken.data.coingeckoId}&vs_currencies=${fiat}`
        ).then(x => x.json())

        return result[chain.nativeToken.data.coingeckoId][fiat] as number
      } catch {
        // Coingecko has rate limit, better to return 0 than to crash the session
        // TODO: find alternative or purchase Coingecko subscription
        return 0
      }
    },
})

export const apiState = atom({
  key: 'PolkadotApi',
  default: selector({
    key: 'PolkadotApi/Default',
    get: async ({ get }) => {
      const chain = get(currentChainState)
      const wsProvider = new WsProvider(chain.rpcs[0]?.url)
      return ApiPromise.create({ provider: wsProvider })
    },
    cachePolicy_UNSTABLE: { eviction: 'most-recent' },
  }),
})

export const nativeTokenDecimalState = selector({
  key: 'NativeTokenDecimal',
  get: ({ get }) => {
    const chain = get(currentChainState)
    return {
      fromAtomics: (value: string | number | bigint | BN | ToBn | undefined) =>
        Decimal.fromAtomics(value, chain.nativeToken.data.decimals, chain.nativeToken.data.symbol),
      fromUserInput: (input: string) =>
        Decimal.fromUserInput(input, chain.nativeToken.data.decimals, chain.nativeToken.data.symbol),
    }
  },
})
