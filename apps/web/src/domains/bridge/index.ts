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

            // temportatily disable Kusama routes
            // example of issue: https://kusama.subscan.io/xcm_message/kusama-98082ccbd5ae3e416b17276a0aaaeadd85aecb7a
            { from: 'altair' },
            { from: 'kusama' },
            { from: 'basilisk' },
            { from: 'bifrost' },
            { from: 'calamari' },
            { from: 'crab' },
            { from: 'khala' },
            { from: 'kintsugi' },
            { from: 'shiden' },
            { from: 'shadow' },
            { from: 'turing' },
            { from: 'heiko' },
            { from: 'integritee' },
            { from: 'kico' },
            { from: 'tinkernet' },
            { from: 'listen' },
            { from: 'pichiu' },
            { from: 'quartz' },
            { from: 'moonriver' },
            { from: 'karura' },
            { from: 'robonomics' },
            { from: 'tinkernet' },
            { from: 'statemine' },
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
