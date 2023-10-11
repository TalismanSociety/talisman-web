import { ApiPromise, WsProvider } from '@polkadot/api'
import { atomFamily } from 'recoil'

import { useSubstrateApiEndpoint } from '..'

export const substrateApiState = atomFamily<ApiPromise, string | undefined>({
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
  dangerouslyAllowMutability: true,
})

export const useSubstrateApiState = () => substrateApiState(useSubstrateApiEndpoint())
