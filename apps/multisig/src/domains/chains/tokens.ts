import { selectorFamily } from 'recoil'
import { graphQLSelectorFamily } from 'recoil-relay'
import { graphql } from 'relay-runtime'

import RelayEnvironment from '../../graphql/relay-environment'

// TODO: batch request all token prices we care about in the session in one request
// (can include multiple ids)
export const tokenPriceState = selectorFamily({
  key: 'TokenPrice',
  get: (coingeckoId?: string) => async () => {
    if (!coingeckoId) return 0
    try {
      const result = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`
      ).then(x => x.json())

      return result[coingeckoId].usd as number
    } catch {
      // Coingecko has rate limit, better to return 0 than to crash the session
      // TODO: find alternative or purchase Coingecko subscription
      return 0
    }
  },
})

export const tokenPricesState = selectorFamily({
  key: 'TokenPrices',
  get:
    (coingeckoIds: (string | undefined)[]) =>
    async ({ get }) => {
      const res: { [key: string]: number } = {}
      coingeckoIds.forEach(id => {
        if (id === undefined) return
        let price = get(tokenPriceState(id))
        res[id] = price
      })
      return res
    },
})

export interface Token {
  id: string
  coingeckoId?: string
  logo: string
  type: string
  symbol: string
  decimals: number
  chain: {
    id: string
  }
}

export const tokenByIdQuery = graphQLSelectorFamily({
  key: 'TokenById',
  environment: RelayEnvironment,
  query: graphql`
    query tokensByIdQuery($id: String!) {
      tokenById(id: $id) {
        data
      }
    }
  `,
  variables: id => ({ id }),
  mapResponse: res => res.tokenById.data as Token,
})

export const tokenByIdWithPrice = selectorFamily({
  key: 'TokenByIdWithPrice',
  get:
    id =>
    async ({ get }) => {
      const token = get(tokenByIdQuery(id))
      if (!token.coingeckoId) return { token, price: 0 }
      const price = get(tokenPriceState(token.coingeckoId))
      return { token, price }
    },
})

export interface Chain {
  id: string
  chainName: string
  logo: string
  isTestnet: boolean
  nativeToken: {
    id: string
  }
  rpc: string
  decimals: number
  ss58Prefix: number
}

export const chainTokensByIdQuery = graphQLSelectorFamily({
  key: 'ChainTokensById',
  environment: RelayEnvironment,
  query: graphql`
    query tokensChainTokensByIdQuery($id: String!) {
      chainById(id: $id) {
        tokens {
          data
        }
      }
    }
  `,
  variables: id => ({ id }),
  mapResponse: res => {
    return res.chainById.tokens.map((item: { data: Token }) => item.data) as Token[]
  },
})
