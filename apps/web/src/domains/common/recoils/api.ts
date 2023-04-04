import { ApiPromise, WsProvider } from '@polkadot/api'
import { PolkadotApiEndpointContext } from '@talismn/polkadot-api-react'
import { useContext } from 'react'
import { atomFamily } from 'recoil'

export const substrateApiState = atomFamily<ApiPromise, string>({
  key: 'SubstrateApiState',
  effects: endpoint => [
    ({ setSelf }) => {
      const api = new ApiPromise({ provider: new WsProvider(endpoint) })

      setSelf(api.isReadyOrError)

      return api.disconnect
    },
  ],
  dangerouslyAllowMutability: true,
})

export const useSubstrateApiState = () => substrateApiState(useContext(PolkadotApiEndpointContext))
