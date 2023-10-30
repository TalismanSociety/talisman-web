import { activeMultisigsState } from '@domains/multisig'
import { selector, selectorFamily } from 'recoil'
import { graphQLSelectorFamily } from 'recoil-relay'
import { graphql } from 'relay-runtime'

import RelayEnvironment from '../../graphql/relay-environment'
import { supportedChains } from './supported-chains'

export type Price = {
  current: number
  averages?: {
    ema30: number
    ema7: number
  }
}

async function callPriceApis(token: BaseToken): Promise<Price> {
  if (!token || !token.coingeckoId) return { current: 0 }
  const { coingeckoId, symbol } = token

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  // get both in format YYYY-MM-DD
  const nowString = now.toISOString().split('T')[0]
  const thirtyDaysAgoString = thirtyDaysAgo.toISOString().split('T')[0]
  // always try to get from coingecko
  const coingeckoPromise = fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`
  ).then(x => x.json())

  // try to get ema prices from subscan
  let subscanId = token.chain.subscanUrl.split('.subscan.io')[0]?.split('https://')[1]
  if (!subscanId) throw Error(`failed to extract subscan id from ${token.chain.subscanUrl}`)
  const subscanCurrentPricePromise = fetch(`https://${subscanId}.api.subscan.io/api/open/price`, {
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
  const subscanHistoryPromise = fetch(`https://${subscanId}.api.subscan.io/api/scan/price/history`, {
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
}

// TODO: batch request all token prices we care about in the session in one request
// (can include multiple ids)
export const tokenPriceState = selectorFamily({
  key: 'TokenPrice',
  get: (token?: BaseToken) => async (): Promise<Price> => {
    if (!token || !token.coingeckoId) return { current: 0 }

    let tries = 0
    while (tries < 30) {
      try {
        const price = await callPriceApis(token)
        return price
      } catch (e) {
        // wait between 2 and 6 seconds before retrying
        // stagger it so we don't have all the requests happening at the same time
        const waitTime = Math.random() * 4000 + 2000
        await new Promise(resolve => setTimeout(resolve, waitTime))
        tries++
      }
    }

    console.error(`couldn't get price for token ${token.id} after many retries`)
    return { current: 0 }
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
  mapResponse: res => {
    // by default, these tokens don't have a fully filled chain property
    // so we need to add it
    const chain = supportedChains.find(c => c.squidIds.chainData === res.tokenById.data.chain.id)
    if (!chain) throw new Error(`chain ${res.tokenById.data.chainId} not found in supported chains`)
    return { ...res.tokenById.data, chain } as BaseToken
  },
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
  genesisHash: string
  chainName: string
  logo: string
  isTestnet: boolean
  nativeToken: {
    id: string
  }
  rpcs: Rpc[]
  ss58Prefix: number
  subscanUrl: string
  polkaAssemblyUrl?: string
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
    // by default, these tokens don't have a fully filled chain property
    // so we need to add it
    return res.chainById.tokens.map((item: { data: { chain: { id: string } } }) => {
      const chain = supportedChains.find(c => c.squidIds.chainData === item.data.chain.id)
      if (!chain) throw new Error(`chain ${res.tokenById.data.chainId} not found in supported chains`)
      return { ...item.data, chain }
    }) as BaseToken[]
  },
})

// Get tokens for all active chains
export const allChainTokensSelector = selector({
  key: 'AllChainTokens',
  get: async ({ get }): Promise<Map<string, BaseToken[]>> => {
    const multisigs = get(activeMultisigsState)

    const entries: [string, BaseToken[]][] = await Promise.all(
      multisigs.map(({ chain }) => [chain.squidIds.chainData, get(chainTokensByIdQuery(chain.squidIds.chainData))])
    )
    return new Map(entries)
  },
  dangerouslyAllowMutability: true, // pjs wsprovider mutates itself to track connection msg stats
})
