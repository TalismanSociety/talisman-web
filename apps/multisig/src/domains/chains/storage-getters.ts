// Abstracting constant getters into these selectors which will reuse pjs API instances (per network).
// When CAPI is ready, the internals of these hooks can be replaced without needing to make many
// changes in other areas of the codebase.
// TODO: refactor code to remove repititon
// TODO: use pjs types instead of force casting

import { pjsApiSelector } from '@domains/chains/pjs-api'
import { Multisig, TransactionApprovals, activeMultisigsState, aggregatedMultisigsState } from '@domains/multisig'
import { Option } from '@polkadot/types-codec'
import { BlockHash, BlockNumber, Multisig as OnChainMultisig, ProxyDefinition } from '@polkadot/types/interfaces'
import { Address } from '@util/addresses'
import { useCallback } from 'react'
import { atom, selector, selectorFamily, useRecoilValueLoadable } from 'recoil'

import { BaseToken, Chain, Rpc, tokenByIdQuery } from './tokens'

export const useAddressIsProxyDelegatee = (chain: Chain) => {
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(chain.rpcs))

  const addressIsProxyDelegatee = useCallback(
    async (proxy: Address, address: Address) => {
      if (apiLoadable.state !== 'hasValue') {
        throw Error('apiLoadable must be ready')
      }

      const api = apiLoadable.contents
      if (!api.query.proxy || !api.query.proxy.proxies) {
        throw Error('proxy.proxies must exist on api')
      }
      const res = (await api.query.proxy.proxies(proxy.bytes)) as unknown as ProxyDefinition[][]
      if (!res[0]) throw Error('invalid proxy.proxies return value')
      return {
        isProxyDelegatee: res[0].some(d => {
          let delegateAddress = Address.fromSs58(d.delegate.toString())
          if (!delegateAddress) {
            console.warn("chain returned a delegate that isn't a valid ss52 address. this should be investigated.")
            return false
          }
          return delegateAddress.isEqual(address) && d.proxyType.toString() === 'Any'
        }),
        proxyDelegatees: res[0]
          .filter(d => d.proxyType.toString() === 'Any')
          .map(d => {
            const a = Address.fromSs58(d.delegate.toString())
            if (!a) {
              console.error("chain returned a delegate that isn't a valid ss52 address. this must be investigated.")
              return new Address(new Uint8Array(32))
            }
            return a
          }),
      }
    },
    [apiLoadable]
  )

  return { addressIsProxyDelegatee, ready: apiLoadable.state === 'hasValue' }
}

// Change this value to the current date to trigger a reload of pending txs
export const rawPendingTransactionsDependency = atom<Date>({
  key: 'RawPendingTransactionsDependency',
  default: new Date(),
})

// The chain `Multisig` storage entry with some augmented data for easier usage.
export interface RawPendingTransaction {
  nativeToken: BaseToken
  multisig: Multisig
  onChainMultisig: OnChainMultisig
  callHash: `0x${string}`
  date: Date
  approvals: TransactionApprovals
}

// fetches the raw txs from the chain
export const rawPendingTransactionsSelector = selectorFamily({
  key: 'rawMultisigPendingTransactionsSelector',
  get:
    (id: string) =>
    async ({ get }): Promise<RawPendingTransaction[]> => {
      // This dependency allows effectively clearing the cache of this selector
      get(rawPendingTransactionsDependency)

      const multisigs = get(activeMultisigsState)
      const multisig = multisigs.find(m => m.id === id)

      if (!multisig) return []

      const api = get(pjsApiSelector(multisig.chain.rpcs))
      await api.isReady
      const nativeToken = get(tokenByIdQuery(multisig.chain.nativeToken.id))

      if (!api.query.multisig?.multisigs) {
        console.error(`multisig.multisigs pallet not found on ${multisig.chain.chainName} chain`)
        return []
      }

      const keys = await api.query.multisig.multisigs.keys(multisig.multisigAddress.bytes)
      const pendingTransactions = (
        await Promise.all(
          keys.map(async key => {
            if (!api.query.multisig?.multisigs) {
              throw Error('multisig.multisigs must exist on api')
            }
            const opt = (await api.query.multisig.multisigs(...key.args)) as unknown as Option<OnChainMultisig>
            if (!opt.isSome) {
              console.warn(
                'multisig.multisigs return value is not Some. This may happen in the extremely rare case that a multisig tx is executed between the .keys query and the .multisigs query, but should be investigated if it is reoccuring.'
              )
              return null
            }
            // attach the date to tx details
            const onChainMultisig = opt.unwrap()
            const hash = get(blockHashSelector({ height: onChainMultisig.when.height, rpcs: multisig.chain.rpcs }))
            const date = new Date(get(blockTimestampSelector({ hash, rpcs: multisig.chain.rpcs })))
            if (!key.args[1]) throw Error('args is length 2; qed.')
            const callHash = key.args[1]
            return {
              nativeToken,
              callHash: callHash.toHex(),
              onChainMultisig,
              multisig: multisig,
              date,
              approvals: multisig.signers.reduce((acc, cur) => {
                const approved = onChainMultisig.approvals.some(a => {
                  const ss52ApprovalAddress = Address.fromSs58(a.toString())
                  if (!ss52ApprovalAddress) {
                    console.warn(
                      "chain returned an approval that isn't a valid ss52 address. this should be investigated."
                    )
                    return false
                  } else {
                    return cur.isEqual(ss52ApprovalAddress)
                  }
                })
                return { ...acc, [cur.toPubKey()]: approved }
              }, {} as TransactionApprovals),
            }
          })
        )
      ).filter((transaction): transaction is RawPendingTransaction => transaction !== null)
      return pendingTransactions
    },

  dangerouslyAllowMutability: true, // pjs wsprovider mutates itself to track connection msg stats
})

// fetches the raw txs from the chain
export const allRawPendingTransactionsSelector = selector({
  key: 'allRawMultisigPendingTransactionsSelector',
  get: async ({ get }): Promise<RawPendingTransaction[]> => {
    try {
      const multisigs = get(aggregatedMultisigsState)

      // query pending transactions of each multisig by ID
      const pendingTransactions = multisigs.map(({ id }) => get(rawPendingTransactionsSelector(id)))
      return pendingTransactions.flat()
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
        return []
      }
      // some recoil.js hackery
      throw error
    }
  },
  dangerouslyAllowMutability: true, // pjs wsprovider mutates itself to track connection msg stats
})

export const blockTimestampSelector = selectorFamily({
  key: 'blockTimestampSelector',
  get:
    ({ hash, rpcs }: { hash: BlockHash; rpcs: Rpc[] }) =>
    async ({ get }): Promise<number> => {
      const api = get(pjsApiSelector(rpcs))
      await api.isReady
      if (!api.query.timestamp?.now) {
        throw Error('timestamp.now must exist on api')
      }
      return (await api.query.timestamp.now.at(hash)).toPrimitive() as number
    },
})

export const blockHashSelector = selectorFamily({
  key: 'blockHashSelector',
  get:
    ({ height, rpcs }: { height: BlockNumber; rpcs: Rpc[] }) =>
    async ({ get }): Promise<BlockHash> => {
      const api = get(pjsApiSelector(rpcs))
      await api.isReady
      return api.rpc.chain.getBlockHash(height)
    },
})
