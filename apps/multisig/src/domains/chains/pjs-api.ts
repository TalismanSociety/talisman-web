import { activeMultisigsState } from '@domains/multisig'
import { ApiPromise, WsProvider } from '@polkadot/api'
import toast from 'react-hot-toast'
import { selector, selectorFamily, useRecoilValueLoadable } from 'recoil'

import { Rpc } from './tokens'

// Grab the pjs api from a selector. The selector caches the result based on the given rpc, so an
// api will will only be created once per rpc.
// WsProvider doesn't seem to do retries correctly, so do it manually.
const TIMEOUT = 10_000
export const pjsApiSelector = selectorFamily({
  key: 'PjsApi',
  get: (rpcs: Rpc[]) => async (): Promise<ApiPromise> => {
    // Return a dummy provider when rpcs are not known
    if (rpcs.length === 0) {
      const provider = new WsProvider([])
      return ApiPromise.create({ provider })
    }

    const timeout = (ms: number): Promise<never> =>
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))

    for (let i = 0; i < rpcs.length; i++) {
      try {
        // @ts-ignore
        const { url: rpcUrl } = rpcs[i] as { url: string }

        const api = await Promise.race([
          (async () => {
            const provider = new WsProvider(rpcUrl)
            const api = await ApiPromise.create({ provider })
            await api.isReady
            await api.isConnected
            return api
          })(),
          timeout(TIMEOUT),
        ])

        return api // If this line is reached, then this RPC succeeded within 3 seconds.
      } catch (err) {
        // If it's the last RPC in the array and it still fails, throw an error.
        if (i === rpcs.length - 1) {
          throw new Error(`All RPCs ${rpcs.join(',')} failed.`)
        }

        // Log the error and move to the next RPC.
        const { url: rpcUrl } = rpcs[i] as { url: string }
        console.warn(`Failed to connect to ${rpcUrl} failed: `, err)
        toast.error(`Failed to connect to ${rpcUrl}: ${err}. Trying a different one...`)
      }
    }

    // If for some reason the loop completes without returning or throwing an error (shouldn't happen):
    toast.error(`No RPCs for this chain worked: ${rpcs.join(',')}`)
    throw Error("No RPCs for this chain worked. This shouldn't happen.")
  },
  dangerouslyAllowMutability: true, // pjs wsprovider mutates itself to track connection msg stats
})

// Get pjs apis for all active multisigs
// returned map key is the chainData id.
export const allPjsApisSelector = selector({
  key: 'AllPjsApis',
  get: async ({ get }): Promise<Map<string, ApiPromise>> => {
    const activeMultisigs = get(activeMultisigsState)
    const entries: [string, ApiPromise][] = activeMultisigs.map(({ chain }) => [
      chain.squidIds.chainData,
      get(pjsApiSelector(chain.rpcs)),
    ])
    return new Map(entries)
  },
  dangerouslyAllowMutability: true, // pjs wsprovider mutates itself to track connection msg stats
})

export const useApi = (rpcs: Rpc[]) => {
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(rpcs))

  return {
    api: apiLoadable.state === 'hasValue' ? apiLoadable.contents : undefined,
    loading: apiLoadable.state === 'loading',
    isReady: apiLoadable.contents?.isReady,
    isConnected: apiLoadable.contents?.isConnected,
  }
}
