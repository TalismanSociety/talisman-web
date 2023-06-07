import { Bridge, type ChainId } from '@polkawallet/bridge'
import { atom, selector, selectorFamily } from 'recoil'
import { bridgeConfig } from './config'
import { substrateApiState } from '@domains/common'

export { bridgeConfig } from './config'

export const includeDisabledRoutesState = atom({
  key: 'IncludeDisabledRoutes',
  default: false,
})

export const bridgeState = selector({
  key: 'Bridge',
  get: async ({ get }) => {
    const bridge = new Bridge({
      adapters: Object.values(bridgeConfig)
        .filter((x): x is NonNullable<typeof x> => x !== undefined)
        .map(x => x.adapter),
      disabledRouters: get(includeDisabledRoutesState)
        ? undefined
        : [
            // TODO: re-enable once we have custom recipient address, to target EVM addresses
            { to: 'moonbeam' },
            { to: 'moonriver' },
            // These has not passed testing
            { from: 'astar', to: 'acala', token: 'LDOT' },
            { from: 'parallel', to: 'acala', token: 'PARA' },
            { from: 'bifrost', to: 'karura', token: 'KAR' },
            { from: 'khala', to: 'karura', token: 'PHA' },
            { from: 'turing', to: 'karura', token: 'TUR' },
            { from: 'bifrost', to: 'karura', token: 'BNC' },
            { from: 'listen', to: 'karura', token: 'LKSM' },
            { from: 'acala', to: 'hydradx', token: 'DAI' },
            { from: 'karura', to: 'basilisk', token: 'DAI' },
          ],
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
      const api = get(substrateApiState(bridgeConfig[chainId].rpc))
      const adapter = get(bridgeState).findAdapter(chainId)
      await adapter.init(api)

      return adapter
    },
  dangerouslyAllowMutability: true,
})
