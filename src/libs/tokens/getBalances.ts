import { u8aToHex } from '@polkadot/util'
import { pick } from 'lodash'

import blake2Concat from './blake2Concat'
import decodeAnyAddress from './decodeAnyAddress'
import getChainList from './getChainList'
import getTokenList from './getTokenList'
import RpcFactory from './RpcFactory'
import twox64Concat from './twox64Concat'
import { Address, Addresses, AddressesByChain, Chain, ChainId, NativeToken, OrmlToken, TokenList } from './types'

const moduleHash = '99971b5749ac43e0235e41b0d3786918'
const storageHash = '8ee7418a6531173d60d1f6a82d8f4d51'
const moduleStorageHash = `${moduleHash}${storageHash}`

const getBalances = async (
  addresses: Addresses
) /*:  Promise<{ [chainId: ChainId]: { [address: Address]: number } }> */ => {
  const chainList = await getChainList()
  const tokenList = await getTokenList()

  const chains = Object.values(chainList ?? {}).map(chain => pick(chain, ['id', 'isHealthy', 'genesisHash']))

  const addressesByChain = chains
    .filter(({ isHealthy }) => isHealthy)
    .reduce((result, chain) => {
      result[chain.id] = Object.entries(addresses)
        .filter(
          ([, genesisHashes]) =>
            genesisHashes === null || (chain.genesisHash && genesisHashes?.includes(chain.genesisHash))
        )
        .map(([address, ,]) => address)
      return result
    }, {} as AddressesByChain)

  const balances = await Promise.all(
    Object.entries(addressesByChain).map(([chainId, addresses]) => {
      const chain: Chain = chainList[chainId]

      if (!chain) {
        throw new Error(`Chain ${chainId} not found`)
      }

      return fetchTokens({ chain, addresses, tokenList })
    })
  )

  return balances
}

const fetchTokens = async ({
  chain,
  addresses,
  tokenList,
}: {
  chain: Chain
  addresses: Address[]
  tokenList: TokenList
}) => {
  const chainTokenIds = chain.tokens?.map(({ id }) => id) || []

  const nativeTokens = Object.values(tokenList).filter(
    token => token.type === 'native' && chainTokenIds.includes(token.id)
  ) as NativeToken[]

  const ormlTokens = Object.values(tokenList).filter(
    token => token.type === 'orml' && chainTokenIds.includes(token.id)
  ) as OrmlToken[]

  const method = 'state_queryStorageAt'

  const nativeParams = buildNativeParams(addresses)
  const nativeReferences = buildNativeReferences(addresses)
  const nativeResponse = await RpcFactory.send(chain.id, method, nativeParams)
  const nativeResult = nativeResponse[0]

  console.log(nativeResult)

  // const native = formatNativeRpcResult(chain, nativeTokens, nativeReferences, nativeResult)

  const ormlParams = buildOrmlParams(addresses, chain.tokensCurrencyIdIndex, ormlTokens)
  const ormlReferences = buildOrmlReferences(addresses, chain.tokensCurrencyIdIndex, ormlTokens)
  const ormlResponse = await RpcFactory.send(chain.id, method, ormlParams)
  const ormlResult = ormlResponse[0]

  console.log(ormlResult)
}

const buildOrmlParams = (addresses: Address[], tokensCurrencyIdIndex: number | null, tokens: OrmlToken[]) => {
  return [
    tokens
      .map(({ index: tokenIndex }) =>
        twox64Concat(new Uint8Array([tokensCurrencyIdIndex || 0, tokenIndex])).replace('0x', '')
      )
      .flatMap(tokenHash =>
        addresses
          .map(address => decodeAnyAddress(address))
          .map(addressBytes => blake2Concat(addressBytes).replace('0x', ''))
          .map(addressHash => `0x${moduleStorageHash}${addressHash}${tokenHash}`)
      ),
  ]
}

const buildNativeParams = (addresses: Address[]) => {
  return [
    addresses
      .map(address => decodeAnyAddress(address))
      .map(addressBytes => blake2Concat(addressBytes).replace('0x', ''))
      .map(addressHash => `0x${moduleStorageHash}${addressHash}`),
  ]
}

const buildOrmlReferences = (
  addresses: Address[],
  tokensCurrencyIdIndex: number | null,
  tokens: OrmlToken[]
): Array<[string, number, string]> => {
  return tokens
    .map(({ index: tokenIndex }): [number, string] => [
      tokenIndex,
      twox64Concat(new Uint8Array([tokensCurrencyIdIndex || 0, tokenIndex])).replace('0x', ''),
    ])
    .flatMap(([index, tokenHash]) =>
      addresses
        .map((address): [string, Uint8Array] => [address, decodeAnyAddress(address)])
        .map(([address, addressBytes]): [string, string] => [address, blake2Concat(addressBytes).replace('0x', '')])
        .map(([address, addressHash]): [string, number, string] => [
          address,
          index,
          `0x${moduleStorageHash}${addressHash}${tokenHash}`,
        ])
    )
}

const buildNativeReferences = (addresses: Address[]): Array<[string, string]> => {
  return addresses
    .map(address => decodeAnyAddress(address))
    .map(decoded => u8aToHex(decoded, -1, false))
    .map((reference, index) => [addresses[index], reference])
}

export default getBalances
