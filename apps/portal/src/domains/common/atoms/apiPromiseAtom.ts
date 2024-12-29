import { ApiPromise } from '@polkadot/api'
import { chainConnectorsAtom } from '@talismn/balances-react'
import * as AvailJsSdk from 'avail-js-sdk'
import { atom } from 'jotai'
import { atomEffect } from 'jotai-effect'
import { atomFamily } from 'jotai/utils'

/**
 * This atom can be used to get access to an `ApiPromise` for talking to a Polkadot blockchain.
 *
 * The advantage of using this atom over creating your own `ApiPromise`, is that the underlying websocket
 * connections will be shared between all code which uses this atom.
 *
 * Also, when the user has Talisman Wallet installed, the underlying websocket connections will be routed
 * through their wallet, thus further reducing the total number of active websocket connections.
 */
export const apiPromiseAtom = atomFamily((chainId?: string) =>
  atom(async get => {
    if (!chainId) return

    const subChainConnector = get(chainConnectorsAtom).substrate
    if (!subChainConnector) return

    const isAvail = ['avail', 'avail-turing-testnet'].includes(chainId)
    const extraProps = isAvail
      ? { types: AvailJsSdk.spec.types, rpc: AvailJsSdk.spec.rpc, signedExtensions: AvailJsSdk.spec.signedExtensions }
      : {}

    const provider = subChainConnector.asProvider(chainId)
    const apiPromise = new ApiPromise({ provider, noInitWarn: true, ...extraProps })

    // register effect to clean up ApiPromise when it's no longer in use
    get(cleanupApiPromiseEffect(chainId, apiPromise))

    return apiPromise
  })
)

const cleanupApiPromiseEffect = (chainId: string | undefined, apiPromise: ApiPromise) =>
  atomEffect(() => {
    return () => {
      apiPromiseAtom.remove(chainId)
      try {
        apiPromise.disconnect()
      } catch (cause) {
        console.warn(`Failed to close ${chainId} apiPromise: ${cause}`)
      }
    }
  })
