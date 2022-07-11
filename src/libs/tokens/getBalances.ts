import { TypeRegistry, createType } from '@polkadot/types'
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
  addresses: Address[]
) /* : Promise<{ [chainId: ChainId]: { [address: Address]: number } } >*/ => {
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

  const promises = Object.entries(addressesByChain).map(([chainId, addresses]) => {
    const chain: Chain = chainList[chainId]

    if (!chain) {
      throw new Error(`Chain ${chainId} not found`)
    }

    return fetchTokens({ chain, addresses, tokenList })
  })

  const balances = await Promise.all(promises)

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

  const ormlTokens = Object.values(tokenList).filter(
    token => token.type === 'orml' && chainTokenIds.includes(token.id)
  ) as OrmlToken[]

  const method = 'state_queryStorageAt'

  const nativeParams = buildNativeParams(addresses)
  const nativeReferences = buildNativeReferences(addresses)
  const nativeResponse = await RpcFactory.send(chain.id, method, nativeParams)
  const nativeResult = nativeResponse[0]

  const native = formatNativeRpcResult(chain, nativeReferences, nativeResult)

  const ormlParams = buildOrmlParams(addresses, chain.tokensCurrencyIdIndex, ormlTokens)
  const ormlReferences = buildOrmlReferences(addresses, chain.tokensCurrencyIdIndex, ormlTokens)
  const ormlResponse = await RpcFactory.send(chain.id, method, ormlParams)
  const ormlResult = ormlResponse[0]

  const orml = formatOrmlRpcResult(chain, ormlTokens, ormlReferences, ormlResult)

  return { native, orml }
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
): Array<[string, string, string]> => {
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

const hasOwnProperty = <X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> => {
  return obj.hasOwnProperty(prop)
}

// AccountInfo is the state_storage data format for nativeToken balances
const AccountInfo = JSON.stringify({
  nonce: 'u32',
  consumer: 'u32',
  providers: 'u32',
  sufficients: 'u32',
  data: {
    free: 'u128',
    reserved: 'u128',
    miscFrozen: 'u128',
    feeFrozen: 'u128',
  },
})
// TODO: Get this from the metadata store if metadata is >= v14
const AccountInfoOverrides: { [key: ChainId]: string } = {
  'crust': JSON.stringify({
    nonce: 'u32',
    consumer: 'u32',
    providers: 'u32',
    data: {
      free: 'u128',
      reserved: 'u128',
      miscFrozen: 'u128',
      feeFrozen: 'u128',
    },
  }),
  'kilt-spiritnet': JSON.stringify({
    nonce: 'u64',
    consumer: 'u32',
    providers: 'u32',
    sufficients: 'u32',
    data: {
      free: 'u128',
      reserved: 'u128',
      miscFrozen: 'u128',
      feeFrozen: 'u128',
    },
  }),
  'zero-io': JSON.stringify({
    nonce: 'u32',
    consumer: 'u32',
    providers: 'u32',
    data: {
      free: 'u128',
      reserved: 'u128',
      miscFrozen: 'u128',
      feeFrozen: 'u128',
    },
  }),
}

const registry = new TypeRegistry()

// TODO change this any
const formatNativeRpcResult = (chain: Chain, addressReferences: Array<[string, string]>, result: any) => {
  if (typeof result !== 'object' || result === null) return []
  if (!hasOwnProperty(result, 'changes') || typeof result.changes !== 'object') return []
  if (!Array.isArray(result.changes)) return []

  const balances = result.changes
    // TODO change this any
    .map(([reference, change]: [unknown, unknown]): any | false => {
      if (typeof reference !== 'string') {
        return false
      }

      if (typeof change !== 'string' && change !== null) {
        return false
      }

      if (!chain.nativeToken) {
        return false
      }

      const [address] = addressReferences.find(([, hex]) => reference.endsWith(hex)) || []
      if (!address) {
        return false
      }

      const accountInfo = AccountInfoOverrides[chain.id] || AccountInfo
      // TODO remove this ts-ignore
      // @ts-ignore
      const balance: any = createType(registry, accountInfo, change)

      const free = (balance.data?.free.toBigInt() || BigInt('0')).toString()
      const reserved = (balance.data?.reserved.toBigInt() || BigInt('0')).toString()
      const miscFrozen = (balance.data?.miscFrozen.toBigInt() || BigInt('0')).toString()
      const feeFrozen = (balance.data?.feeFrozen.toBigInt() || BigInt('0')).toString()

      return {
        pallet: 'balances',
        status: 'live',
        address,
        chainId: chain.id,
        tokenId: chain.nativeToken.id,
        free,
        reserved,
        miscFrozen,
        feeFrozen,
      }
    })
    .filter(Boolean)

  return balances
}

// TODO change this any
const formatOrmlRpcResult = (
  chain: Chain,
  tokens: OrmlToken[],
  references: Array<[string, string, string]>,
  result: unknown
) => {
  if (typeof result !== 'object' || result === null) return []
  if (!hasOwnProperty(result, 'changes') || typeof result.changes !== 'object') return []
  if (!Array.isArray(result.changes)) return []

  const balances = result.changes
    // TODO change this any
    .map(([reference, change]: [unknown, unknown]): any | false => {
      if (typeof reference !== 'string') {
        return false
      }

      if (typeof change !== 'string' && change !== null) {
        return false
      }

      const [address, tokenStateKey] = references.find(([, , hex]) => reference === hex) || []
      if (address === undefined || tokenStateKey === undefined) {
        return false
      }

      const token = tokens.find(({ stateKey }) => stateKey === tokenStateKey)
      if (!token) {
        return false
      }

      const balance: any = createType(registry, AccountData, change)

      const free = (balance.free.toBigInt() || BigInt('0')).toString()
      const reserved = (balance.reserved.toBigInt() || BigInt('0')).toString()
      const frozen = (balance.frozen.toBigInt() || BigInt('0')).toString()

      return {
        pallet: 'orml-tokens',

        status: 'live',

        address,
        chainId: chain.id,
        tokenId: token.id,

        free,
        reserved,
        frozen,
      }
    })
    .filter(Boolean)

  return balances
}

export default getBalances
