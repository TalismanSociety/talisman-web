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
