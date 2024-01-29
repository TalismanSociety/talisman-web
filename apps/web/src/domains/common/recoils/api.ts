import { ApiPromise, WsProvider } from '@polkadot/api'
import { atomFamily } from 'recoil'

import { useSubstrateChainGenesisHash } from '..'
import { chainState } from '@domains/chains'

export const substrateApiState = atomFamily<ApiPromise, `0x${string}`>({
  key: 'SubstrateApiState',
  effects: genesisHash => [
    ({ setSelf, getPromise }) => {
      const getApi = async () => {
        const chain = await getPromise(chainState({ genesisHash }))
        return await ApiPromise.create({ provider: new WsProvider(chain.rpcs?.map(x => x.url)) })
      }

      const apiPromise = getApi()

      setSelf(apiPromise)

      return () => {
        void apiPromise.then(async api => await api.disconnect())
      }
    },
  ],
  dangerouslyAllowMutability: true,
})

export const useSubstrateApiState = () => substrateApiState(useSubstrateChainGenesisHash())
