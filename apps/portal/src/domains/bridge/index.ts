import { chainState } from '../chains'
import { substrateApiState } from '../common'
import { bridgeConfig } from './config'
import { Bridge, type ChainId } from '@polkawallet/bridge'
import { selector, selectorFamily } from 'recoil'

export { bridgeConfig } from './config'

export const bridgeState = selector({
  key: 'Bridge',
  get: async () => {
    const bridge = new Bridge({
      adapters: Object.values(bridgeConfig)
        .filter((x): x is NonNullable<typeof x> => x !== undefined)
        .map(x => x.adapter),
    })
    await bridge.isReady
    return bridge
  },
  dangerouslyAllowMutability: true,
})

export const bridgeAdapterState = selectorFamily({
  key: 'BridgeAdapter',
  get:
    (chainId: ChainId) =>
    async ({ get }) => {
      const genesisHash = bridgeConfig[chainId]?.genesisHash

      if (genesisHash === undefined) {
        throw new Error(`Unable to find genesis hash for chain: ${chainId}`)
      }

      const api = get(substrateApiState(get(chainState({ genesisHash })).rpc))
      const adapter = get(bridgeState).findAdapter(chainId)
      await adapter.init(api)

      return adapter
    },
  dangerouslyAllowMutability: true,
})
