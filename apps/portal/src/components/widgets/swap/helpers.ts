import { evmErc20TokenId, evmNativeTokenId } from '@talismn/chaindata-provider'
import { atom } from 'jotai'

type KnownEvmToken = {
  symbol: string
  coingeckoId: string
  contractAddress: `0x${string}`
  decimals: number
}

type KnownEvmNetwork = {
  id: string
  name: string
  rpcs: string[]
  icon: string
  explorerUrl: string
  balancesConfig: {
    'evm-native': {
      symbol: string
      decimals: number
      coingeckoId: string
    }
    'evm-erc20': {
      tokens: KnownEvmToken[]
    }
  }
}

type KnownTokensById = Record<
  string,
  Omit<KnownEvmToken, 'contractAddress'> & { id: string; contractAddress?: `0x${string}` }
>

type KnownEvmNetworkTokensById = Omit<KnownEvmNetwork, 'balancesConfig'> & {
  tokens: KnownTokensById
  nativeToken: KnownTokensById[string]
}

export const knownEvmNetworksAtom = atom(async () => {
  // TODO: After upgrading Portal to chaindata v4, replace this with `useTokens` from `@talismn/balances-react`
  const res = await fetch(
    'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/data/generated/known-evm-networks-deprecated.json'
  )
  const data = (await res.json()) as KnownEvmNetwork[]
  const organized = data.reduce((acc, curNetwork) => {
    const tokensById = curNetwork.balancesConfig['evm-erc20']?.tokens?.reduce((acc, cur) => {
      const tokenId = evmErc20TokenId(curNetwork.id, cur.contractAddress)
      acc[tokenId] = {
        ...cur,
        id: tokenId,
      }
      return acc
    }, {} as KnownTokensById)

    const nativeTokenId = evmNativeTokenId(curNetwork.id)
    const network: KnownEvmNetworkTokensById = acc[curNetwork.id] ?? {
      ...curNetwork,
      nativeToken: {
        ...curNetwork.balancesConfig['evm-native'],
        id: nativeTokenId,
      },
      tokens: {
        [nativeTokenId]: {
          ...curNetwork.balancesConfig['evm-native'],
          id: nativeTokenId,
        },
        ...tokensById,
      },
    }
    acc[curNetwork.id] = network
    return acc
  }, {} as Record<string, KnownEvmNetworkTokensById>)
  return organized
})
