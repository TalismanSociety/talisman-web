import type { InjectedAccount } from '@polkadot/extension-inject/types'
import { selectorFamily } from 'recoil'
import { graphQLSelectorFamily } from 'recoil-relay'
import { graphql } from 'relay-runtime'

import RelayEnvironment from '../../graphql/relay-environment'

export type Account = InjectedAccount & {
  readonly?: boolean
}

// TODO: batch request all token prices we care about in the session in one request
// (can include multiple ids)
export const tokenPriceState = selectorFamily({
  key: 'TokenPrice',
  get:
    ({ coingeckoId }: { coingeckoId: string }) =>
    async () => {
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

export interface Token {
  id: string
  coingeckoId: string
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
    query chainsTokenByIdQuery($id: String!) {
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
      const price = await get(tokenPriceState({ coingeckoId: token.coingeckoId }))
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
}

export const chainTokensByIdQuery = graphQLSelectorFamily({
  key: 'ChainTokensById',
  environment: RelayEnvironment,
  query: graphql`
    query chainsChainTokensByIdQuery($id: String!) {
      chainById(id: $id) {
        tokens {
          data
        }
      }
    }
  `,
  variables: id => ({ id }),
  mapResponse: res => res.chainById.tokens as Token[],
})

export const supportedChains: Chain[] = [
  {
    id: 'polkadot',
    chainName: 'Polkadot',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/polkadot.svg',
    isTestnet: false,
    nativeToken: {
      id: 'polkadot-substrate-native-dot',
    },
    rpc: 'wss://rpc.polkadot.io',
    decimals: 10,
  },
  {
    id: 'kusama',
    chainName: 'Kusama',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/kusama.svg',
    isTestnet: false,
    nativeToken: {
      id: 'kusama-substrate-native-ksm',
    },
    rpc: 'wss://kusama-rpc.polkadot.io',
    decimals: 12,
  },
  {
    id: 'westend-testnet',
    chainName: 'Westend',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/westend-testnet.svg',
    isTestnet: true,
    nativeToken: {
      id: 'westend-testnet-substrate-native-wnd',
    },
    rpc: 'wss://westend-rpc.polkadot.io',
    decimals: 12,
  },
  {
    id: 'rococo-testnet',
    chainName: 'Rococo',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/rococo-testnet.svg',
    isTestnet: true,
    nativeToken: {
      id: 'rococo-testnet-substrate-native-roc',
    },
    rpc: 'wss://rococo-rpc.polkadot.io',
    decimals: 12,
  },
]
