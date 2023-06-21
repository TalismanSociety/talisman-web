// Abstracting constant getters into these selectors which will reuse pjs API instances (per network).
// When CAPI is ready, the internals of these hooks can be replaced without needing to make many
// changes in other areas of the codebase.
// TODO: refactor code to remove repititon
// TODO: use pjs types instead of force casting

import { pjsApiSelector } from '@domains/chains/pjs-api'
import { TransactionApprovals, selectedMultisigState } from '@domains/multisig'
import { StorageKey } from '@polkadot/types'
import { Option } from '@polkadot/types-codec'
import { BlockHash, BlockNumber, Multisig, ProxyDefinition } from '@polkadot/types/interfaces'
import { useCallback } from 'react'
import { selector, selectorFamily, useRecoilValueLoadable } from 'recoil'

import { Chain } from './tokens'

export const useAddressIsProxyDelegatee = (chain: Chain) => {
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(chain.rpc))

  const addressIsProxyDelegatee = useCallback(
    async (proxy: string, address: string) => {
      if (apiLoadable.state !== 'hasValue') {
        throw Error('apiLoadable must be ready')
      }

      const api = apiLoadable.contents
      if (!api.query.proxy || !api.query.proxy.proxies) {
        throw Error('proxy.proxies must exist on api')
      }
      const res = (await api.query.proxy.proxies(proxy)) as unknown as ProxyDefinition[][]
      if (!res[0]) throw Error('invalid proxy.proxies return value')
      return res[0].some(d => d.delegate.toString() === address && d.proxyType.toString() === 'Any')
    },
    [apiLoadable]
  )

  return { addressIsProxyDelegatee, ready: apiLoadable.state === 'hasValue' }
}

// The chain `Multisig` storage entry with some augmented data for easier usage.
export interface RawPendingTransaction {
  multisig: Multisig
  callHash: `0x${string}`
  date: Date
  approvals: TransactionApprovals
}

// fetches the raw txs from the chain
export const rawPendingTransactionsSelector = selector({
  key: 'rawMultisigPendingTransactionsSelector',
  get: async ({ get }): Promise<RawPendingTransaction[]> => {
    const selectedMultisig = get(selectedMultisigState)
    const api = get(pjsApiSelector(selectedMultisig.chain.rpc))
    await api.isReady

    if (!api.query.multisig?.multisigs) {
      throw Error('multisig.multisigs must exist on api')
    }
    const keys = (await api.query.multisig.multisigs.keys(selectedMultisig.multisigAddress)) as unknown as StorageKey[]
    const pendingTransactions = (
      await Promise.all(
        keys.map(async key => {
          if (!api.query.multisig?.multisigs) {
            throw Error('multisig.multisigs must exist on api')
          }
          const opt = (await api.query.multisig.multisigs(...key.args)) as unknown as Option<Multisig>
          if (!opt.isSome) {
            console.warn(
              'multisig.multisigs return value is not Some. This may happen in the extremely rare case that a multisig tx is executed between the .keys query and the .multisigs query, but should be investigated if it is reoccuring.'
            )
            return null
          }
          // attach the date to tx details
          const multisig = opt.unwrap()
          const hash = get(blockHashSelector(multisig.when.height))
          const date = new Date(get(blockTimestampSelector(hash)))
          if (!key.args[1]) throw Error('args is length 2; qed.')
          const callHash = key.args[1]
          return {
            callHash: callHash.toHex(),
            multisig,
            date,
            approvals: selectedMultisig.signers.reduce((acc, cur) => {
              const approved = multisig.approvals.some(a => a.toString() === cur)
              return { ...acc, [cur]: approved }
            }, {} as TransactionApprovals),
          }
        })
      )
    ).filter((transaction): transaction is RawPendingTransaction => transaction !== null)

    return pendingTransactions
  },
  dangerouslyAllowMutability: true, // pjs wsprovider mutates itself to track connection msg stats
})

export const blockTimestampSelector = selectorFamily({
  key: 'blockTimestampSelector',
  get:
    (hash: BlockHash) =>
    async ({ get }): Promise<number> => {
      const selectedMultisig = get(selectedMultisigState)
      const api = get(pjsApiSelector(selectedMultisig.chain.rpc))
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
    (height: BlockNumber) =>
    async ({ get }): Promise<BlockHash> => {
      const selectedMultisig = get(selectedMultisigState)
      const api = get(pjsApiSelector(selectedMultisig.chain.rpc))
      await api.isReady
      return api.rpc.chain.getBlockHash(height)
    },
})
