import { chainState } from '@domains/chains'
import { substrateApiState } from '@domains/common'
import { Bridge, type ChainId } from '@polkawallet/bridge'
import { selector, selectorFamily } from 'recoil'
import { bridgeConfig } from './config'

export { bridgeConfig } from './config'

export const bridgeState = selector({
  key: 'Bridge',
  get: async () => {
    const bridge = new Bridge({
      adapters: Object.values(bridgeConfig)
        .filter((x): x is NonNullable<typeof x> => x !== undefined)
        .map(x => x.adapter),
      disabledRouters: [
        // Temporarily disable Kusama routes
        // due to: https://github.com/paritytech/polkadot-sdk/issues/3050
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
        { from: 'assetHubKusama' },
        // Disable Asset Hub due to similarly reported issue
        { from: 'assetHubPolkadot' },
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
