import { SwapSDK, type ChainflipNetwork, type Chain } from '@chainflip/sdk/swap'
import '@polkadot/api-augment/substrate'
import '@talismn/ui/assets/css/talismn.css'
import { atom, selector } from 'recoil'

const ENABLED_CHAINS: Chain[] = ['Ethereum', 'Polkadot']

export const chainflipNetworkState = atom<ChainflipNetwork>({
  key: 'chainflipNetwork',
  default: 'mainnet',
})

export const swapSdkState = selector({
  key: 'chainflipSwapSdk',
  get: ({ get }) =>
    new SwapSDK({
      network: get(chainflipNetworkState),
    }),
  dangerouslyAllowMutability: true,
})

export const polkadotRpcAtom = selector({
  key: 'polkadotRpc',
  get: ({ get }) =>
    get(chainflipNetworkState) === 'mainnet'
      ? 'wss://polkadot.api.onfinality.io/public'
      : 'wss://rpc-pdot.chainflip.io',
  dangerouslyAllowMutability: true,
})

export const chainflipChainsState = selector({
  key: 'chainflipChains',
  get: async ({ get }) => await get(swapSdkState).getChains(),
  dangerouslyAllowMutability: true,
})

export const chainflipAssetsState = selector({
  key: 'chainflipAssets',
  get: async ({ get }) => await get(swapSdkState).getAssets(),
  dangerouslyAllowMutability: true,
})

export const chainflipAssetsAndChainsState = selector({
  key: 'chainflipAssetsAndChains',
  get: async ({ get }) => {
    const _assets = get(chainflipAssetsState)
    const _chains = get(chainflipChainsState)

    const chains = _chains.filter(chain => ENABLED_CHAINS.includes(chain.chain))
    const assets = _assets
      .map(asset => ({ ...asset, chain: chains.find(chain => chain.chain === asset.chain) }))
      .filter(a => !!a.chain)

    return { assets, chains }
  },
})
