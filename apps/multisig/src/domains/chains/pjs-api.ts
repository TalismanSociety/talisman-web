import { ApiPromise, WsProvider } from '@polkadot/api'
import { selectorFamily } from 'recoil'

// Grab the pjs api from a selector. The selector caches the result based on the given rpc,
// so an api will will only be created once per rpc.
export const pjsApiSelector = selectorFamily({
  key: 'PjsApi',
  get: (rpc: string) => () => {
    const provider = new WsProvider(rpc, 1000)
    return ApiPromise.create({ provider })
  },
  dangerouslyAllowMutability: true, // pjs wsprovider mutates itself to track connection msg stats
})
