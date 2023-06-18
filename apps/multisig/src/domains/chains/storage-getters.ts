// Abstracting constant getters into these selectors which will reuse pjs API instances (per network).
// When CAPI is ready, the internals of these hooks can be replaced without needing to make many
// changes in other areas of the codebase.
// TODO: refactor code to remove repititon
// TODO: use pjs types instead of force casting

import { pjsApiSelector } from '@domains/chains/pjs-api'
import { selectedMultisigState } from '@domains/multisig'
import { StorageKey } from '@polkadot/types'
import { Option } from '@polkadot/types-codec'
import { BlockHash, Multisig, ProxyDefinition } from '@polkadot/types/interfaces'
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

export const multisigPendingTransactionsSelector = selector({
  key: 'multisigPendingTransactionsSelector',
  get: async ({ get }) => {
    const selectedMultisig = get(selectedMultisigState)
    const api = get(pjsApiSelector(selectedMultisig.chain.rpc))
    await api.isReady

    if (!api.query.multisig?.multisigs) {
      throw Error('multisig.multisigs must exist on api')
    }
    const keys = (await api.query.multisig.multisigs.keys(selectedMultisig.multisigAddress)) as unknown as StorageKey[]
    const pendingTransactions = await Promise.all(
      keys
        .map(async key => {
          if (!api.query.multisig?.multisigs) {
            throw Error('timestamp.now must exist on api')
          }
          const opt = (await api.query.multisig.multisigs(...key.args)) as unknown as Option<Multisig>
          if (!opt.isSome) {
            console.warn(
              'multisig.multisigs return value is not Some. This may happen in the extremely rare case that a multisig tx is executed between the .keys query and the .multisigs query, but should be investigated if it is reoccuring.'
            )
            return null
          }
          // attach the date to tx details
          const multisigTx = opt.unwrap()
          const hash = await api.rpc.chain.getBlockHash(multisigTx.when.height)
          const date = new Date(get(getBlockHashSelector(hash)))
          const callHash = key.args[1]
          return [callHash, opt.unwrap(), date]
        })
        .filter(v => v !== null)
    )
    return pendingTransactions
  },
  dangerouslyAllowMutability: true, // pjs wsprovider mutates itself to track connection msg stats
})

// put this in a selector so it gets cached
export const getBlockHashSelector = selectorFamily({
  key: 'getBlockHashSelector',
  get:
    (hash: BlockHash | string) =>
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
