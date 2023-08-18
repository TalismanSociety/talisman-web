import { activeMultisigsState } from '@domains/multisig'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { selector, selectorFamily } from 'recoil'

// Grab the pjs api from a selector. The selector caches the result based on the given rpc, so an
// api will will only be created once per rpc.
export const pjsApiSelector = selectorFamily({
  key: 'PjsApi',
  get: (rpc?: string) => async () => {
    const provider = new WsProvider(rpc, 1000)
    const api = await ApiPromise.create({ provider })
    await api.isReady
    await api.isConnected
    return api
  },
  dangerouslyAllowMutability: true, // pjs wsprovider mutates itself to track connection msg stats
})

interface PjsApis {
  [rpc: string]: ApiPromise
}

// Get pjs apis for all active multisigs
export const allPjsApisSelector = selector({
  key: 'AllPjsApis',
  get: async ({ get }): Promise<PjsApis> => {
    const activeMultisigs = get(activeMultisigsState)
    const rpcs = activeMultisigs.map(({ chain }) => chain.rpc)
    const entries = await Promise.all(rpcs.map(rpc => [rpc, get(pjsApiSelector(rpc))]))
    return Object.fromEntries(entries)
  },
  dangerouslyAllowMutability: true, // pjs wsprovider mutates itself to track connection msg stats
})
