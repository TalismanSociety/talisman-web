import { ApiPromise, WsProvider } from '@polkadot/api'
import { atomFamily } from 'recoil'

import { useSubstrateApiEndpoint } from '..'

export const substrateApiState = atomFamily<ApiPromise, string>({
  key: 'SubstrateApiState',
  effects: endpoint => [
    ({ setSelf }) => {
      const apiPromise = ApiPromise.create({ provider: new WsProvider(endpoint) })

      setSelf(apiPromise)

      return () => {
        void apiPromise.then(async api => await api.disconnect())
      }
    },
  ],
  dangerouslyAllowMutability: true, // pjs wsprovider mutates itself to track connection msg stats
})

export const useSubstrateApiState = () => substrateApiState(useSubstrateApiEndpoint())
