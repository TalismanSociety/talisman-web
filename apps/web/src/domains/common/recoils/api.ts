import { ApiPromise, WsProvider } from '@polkadot/api'
import { useContext } from 'react'
import { atomFamily } from 'recoil'

import { SubstrateApiContext } from '..'

export const substrateApiState = atomFamily<ApiPromise, string>({
  key: 'SubstrateApiState',
  effects: endpoint => [
    ({ setSelf }) => {
      const apiPromise = ApiPromise.create({ provider: new WsProvider(endpoint) })

      setSelf(apiPromise)

      return () => apiPromise.then(api => api.disconnect())
    },
  ],
  dangerouslyAllowMutability: true,
})

export const useSubstrateApiState = () => substrateApiState(useContext(SubstrateApiContext).endpoint)
