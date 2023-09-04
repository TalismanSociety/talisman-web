import { multisigsState } from '@domains/multisig'
import { selector, selectorFamily } from 'recoil'
import { graphQLSelectorFamily } from 'recoil-relay'
import { graphql } from 'relay-runtime'

import RelayEnvironment from '../../graphql/relay-environment'

export type Price = {
  current: number
  averages?: {
    ema30: number
    ema7: number
  }
}

// TODO: batch request all token prices we care about in the session in one request
// (can include multiple ids)
export const tokenPriceState = selectorFamily({
  key: 'TokenPrice',
  get: (token?: BaseToken) => async (): Promise<Price> => {
    if (!token || !token.coingeckoId) return { current: 0 }

    const { coingeckoId, symbol } = token

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // get both in format YYYY-MM-DD
    const nowString = now.toISOString().split('T')[0]
    const thirtyDaysAgoString = thirtyDaysAgo.toISOString().split('T')[0]

    try {
      // always try to get from coingecko
      const coingeckoPromise = fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`
      ).then(x => x.json())

      // if the token is DOT, we can also get moving average info from subscan
      let subscanHistoryPromise: Promise<any> = Promise.reject().catch(() => {})
      let subscanCurrentPricePromise: Promise<any> = Promise.reject().catch(() => {})
      if (token.symbol === 'DOT') {
        subscanCurrentPricePromise = fetch('https://polkadot.api.subscan.io/api/open/price', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            base: symbol,
            quote: 'USD',
            time: now.getTime(),
          }),
        }).then(x => x.json())
        subscanHistoryPromise = fetch('https://polkadot.api.subscan.io/api/scan/price/history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            start: thirtyDaysAgoString,
            end: nowString,
            currency: symbol,
          }),
        }).then(x => x.json())
      }

      const [cgCurrentPrice, ssCurrentPrice, ssHistorical] = await Promise.allSettled([
        coingeckoPromise,
        subscanCurrentPricePromise,
        subscanHistoryPromise,
      ])

      // if all are fufilled, we should be able to get the emas
      if (
        cgCurrentPrice.status === 'fulfilled' &&
        cgCurrentPrice.value !== undefined &&
        ssCurrentPrice.status === 'fulfilled' &&
        ssCurrentPrice.value !== undefined &&
        ssHistorical.status === 'fulfilled' &&
        ssHistorical.value !== undefined
      ) {
        const coingeckoCurPrice = cgCurrentPrice.value[coingeckoId].usd as number
        const subscanCurPrice = ssCurrentPrice.value.data.price as number
        // sanity check that the prices are close (in case subscan is giving us info for the wrong token)
        if (Math.abs(coingeckoCurPrice - subscanCurPrice) / coingeckoCurPrice > 0.1) {
          return { current: coingeckoCurPrice }
        }

        const ema30 = ssHistorical.value.data.ema30_average as number
        const ema7 = ssHistorical.value.data.ema7_average as number
        return {
          current: coingeckoCurPrice,
          averages: {
            ema30,
            ema7,
          },
        }
      }

      if (cgCurrentPrice.status === 'fulfilled' && cgCurrentPrice.value !== undefined) {
        return { current: cgCurrentPrice.value[coingeckoId].usd as number }
      }

      return { current: 0 }
    } catch (e) {
      // apis have a rate limit. better to return 0 than to crash the session
      // TODO: find alternative or purchase Coingecko subscription
      console.error(`Error fetching price for ${coingeckoId}, returning zero: ${e}`)
      return { current: 0 }
    }
  },
})

export const tokenPricesState = selectorFamily({
  key: 'TokenPrices',
  get:
    (tokens: (BaseToken | undefined)[]) =>
    async ({ get }) => {
      const res: { [key: string]: Price } = {}
      tokens.forEach(t => {
        if (t?.coingeckoId === undefined) return
        let price = get(tokenPriceState(t))
        res[t.coingeckoId] = price
      })
      return res
    },
})

export type BaseToken = {
  id: string
  coingeckoId?: string
  logo: string
  type: string
  symbol: string
  decimals: number
  chain: Chain
}

export type SubstrateNativeToken = {
  type: 'substrate-native'
} & BaseToken

export type SubstrateAssetsToken = {
  type: 'substrate-assets'
  assetId: string
} & BaseToken

export type SubstrateTokensToken = {
  type: 'substrate-tokens'
  onChainId: number
} & BaseToken

export const isSubstrateNativeToken = (token: BaseToken): token is SubstrateNativeToken =>
  token.type === 'substrate-native'

export const isSubstrateAssetsToken = (token: BaseToken): token is SubstrateAssetsToken =>
  token.type === 'substrate-assets'

export const isSubstrateTokensToken = (token: BaseToken): token is SubstrateTokensToken =>
  token.type === 'substrate-tokens'

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
  variables: id => ({ id: id || '' }),
  mapResponse: res => res.tokenById.data as BaseToken,
})

export const tokenByIdWithPrice = selectorFamily({
  key: 'TokenByIdWithPrice',
  get:
    id =>
    async ({ get }): Promise<{ token: BaseToken; price: Price }> => {
      const token = get(tokenByIdQuery(id))
      if (!token.coingeckoId) return { token, price: { current: 0 } }
      const price = get(tokenPriceState(token))
      return { token, price }
    },
})

export type Rpc = {
  url: string
}

export type Chain = {
  squidIds: {
    chainData: string
    txHistory: string
  }
  chainName: string
  logo: string
  isTestnet: boolean
  nativeToken: {
    id: string
  }
  rpcs: Rpc[]
  ss58Prefix: number
  subscanUrl: string
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
  variables: id => {
    return { id }
  },
  mapResponse: res => {
    return res.chainById.tokens.map((item: { data: BaseToken }) => item.data) as BaseToken[]
  },
})

// Get pjs apis for all active multisigs
// returned map key is the chainData id.
export const allChainTokensSelector = selector({
  key: 'AllChainTokens',
  get: async ({ get }): Promise<Map<string, BaseToken[]>> => {
    const multisigs = get(multisigsState)
    const entries: [string, BaseToken[]][] = await Promise.all(
      multisigs.map(({ chain }) => [chain.squidIds.chainData, get(chainTokensByIdQuery(chain.squidIds.chainData))])
    )
    return new Map(entries)
  },
  dangerouslyAllowMutability: true, // pjs wsprovider mutates itself to track connection msg stats
})
