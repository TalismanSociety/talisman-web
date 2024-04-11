import { ApiPromise, WsProvider } from '@polkadot/api'
import { selectorFamily } from 'recoil'

import { useSubstrateApiEndpoint } from '..'

export const substrateApiState = selectorFamily<ApiPromise, string | undefined>({
  key: 'SubstrateApiState',
  get: endpoint => async () => await ApiPromise.create({ provider: new WsProvider(endpoint) }),
  dangerouslyAllowMutability: true,
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export const useSubstrateApiState = () => substrateApiState(useSubstrateApiEndpoint())
