import { useSubstrateApiEndpoint } from '..'
import { chainsState } from '@/domains/chains'
import { ApiPromise, WsProvider } from '@polkadot/api'
import * as AvailJsSdk from 'avail-js-sdk'
import { selectorFamily } from 'recoil'

export const substrateApiState = selectorFamily<ApiPromise, string | undefined>({
  key: 'SubstrateApiState',
  get:
    endpoint =>
    async ({ get }) => {
      const availEndpoints = (get(chainsState).find(chain => chain.id === 'avail')?.rpcs ?? []).map(({ url }) => url)
      const isAvail = endpoint && availEndpoints.includes(endpoint)
      if (isAvail)
        return await ApiPromise.create({
          provider: new WsProvider(endpoint),
          types: AvailJsSdk.spec.types,
          rpc: AvailJsSdk.spec.rpc,
          signedExtensions: AvailJsSdk.spec.signedExtensions,
        })

      return await ApiPromise.create({ provider: new WsProvider(endpoint) })
    },
  dangerouslyAllowMutability: true,
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export const useSubstrateApiState = () => substrateApiState(useSubstrateApiEndpoint())
