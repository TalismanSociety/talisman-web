import {
  SwappableChainId,
  type ChainflipSwappableAsset,
  type SwappableChainType,
  SupportedChainType,
  SupportedSwapProtocol,
} from './swap.types'
import { SwapSDK, type ChainflipNetwork, type Chain } from '@chainflip/sdk/swap'
import { atom, selector, selectorFamily } from 'recoil'

const CHAINFLIP_CHAIN_ID_MAP: Record<Chain, SwappableChainId> = {
  Arbitrum: SwappableChainId.Arbitrum,
  Ethereum: SwappableChainId.Ethereum,
  Polkadot: SwappableChainId.Polkadot,
  Bitcoin: SwappableChainId.Unsupported,
}

export const chainflipNetworkState = atom<ChainflipNetwork>({
  key: 'chainflipNetwork',
  default: 'mainnet',
})

export const polkadotRpcAtom = selector({
  key: 'polkadotRpc',
  get: ({ get }) =>
    get(chainflipNetworkState) === 'mainnet'
      ? 'wss://polkadot.api.onfinality.io/public'
      : 'wss://rpc-pdot.chainflip.io',
  dangerouslyAllowMutability: true,
})

export const swapSdkState = selector({
  key: 'chainflipSwapSdk',
  get: ({ get }) =>
    new SwapSDK({
      network: get(chainflipNetworkState),
    }),
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

const mockedArbitrum = {
  chain: 'Arbitrum' as Chain,
  evmChainId: 42161,
  isMainnet: true,
  name: 'Arbitrum',
  requiredBlockConfirmations: 7,
}

const mockedArbToken = {
  asset: 'ARB' as any,
  chain: 'Arbitrum' as Chain,
  chainflipId: 'Arb' as any,
  contractAddress: '0x912ce59144191c1204e64559fe8253a0e49e6548',
  decimals: 18,
  minimumSwapAmount: '100000000000000000',
  isMainnet: true,
  maximumSwapAmount: '10000000000000000000000',
  minimumEgressAmount: '100000000000000000',
  name: 'ARB',
  symbol: 'ARB',
}

export const chainflipAssetsAndChainsState = selector({
  key: 'chainflipAssetsAndChains',
  get: async ({ get }) => {
    const _assets = get(chainflipAssetsState)
    const _chains = get(chainflipChainsState)

    _assets.push(mockedArbToken)
    _chains.push(mockedArbitrum)

    const chains = _chains.filter(chain => CHAINFLIP_CHAIN_ID_MAP[chain.chain] !== SwappableChainId.Unsupported)
    const assets = _assets
      .map(asset => ({ ...asset, chain: chains.find(chain => chain.chain === asset.chain)! }))
      .filter(a => !!a.chain)

    return { assets, chains }
  },
})

export const chainflipSwappableChains = selector({
  key: 'chainflipSwappableChains',
  get: ({ get }): SwappableChainType[] => {
    const { chains } = get(chainflipAssetsAndChainsState)
    return chains.map(
      (chain): SwappableChainType => ({
        chainId: CHAINFLIP_CHAIN_ID_MAP[chain.chain],
        name: chain.name,
        type: chain.evmChainId === undefined ? SupportedChainType.substrate : SupportedChainType.evm,
        evmChainId: chain.evmChainId,
        isMainnet: chain.isMainnet,
      })
    )
  },
})

export const chainflipSwappableAssets = selector({
  key: 'chainflipSwappableAssets',
  get: ({ get }): ChainflipSwappableAsset[] => {
    const assets = get(chainflipAssetsState)
    const chains = get(chainflipSwappableChains)

    const swappableAssets: ChainflipSwappableAsset[] = []
    for (const asset of assets) {
      const chain = chains.find(c => c.chainId === CHAINFLIP_CHAIN_ID_MAP[asset.chain])
      if (!chain) continue
      swappableAssets.push({
        name: asset.name,
        protocol: SupportedSwapProtocol.chainflip,
        chainId: chain.chainId,
        decimals: asset.decimals,
        symbol: asset.symbol,
        contractAddress: asset.contractAddress,
        data: asset,
      })
    }
    return swappableAssets
  },
})

export const chainflipToTokensSelector = selectorFamily({
  key: 'chainflipToTokensSelector',
  get:
    ([fromAssetSymbol, chainId]: [string, SwappableChainId]) =>
    ({ get }) =>
      get(chainflipSwappableAssets).filter(
        a => !(a.chainId === chainId && a.symbol.toLowerCase() === fromAssetSymbol.toLowerCase())
      ),
})
