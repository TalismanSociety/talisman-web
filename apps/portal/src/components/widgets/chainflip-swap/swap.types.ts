import { type AssetData } from '@chainflip/sdk/swap'

export enum SupportedChainType {
  evm = 'evm',
  substrate = 'substrate',
}

export enum SupportedSwapProtocol {
  chainflip = 'chainflip',
}

export enum SwappableChainId {
  Ethereum = 1,
  Arbitrum = 42161,
  Polkadot = 'polkadot',
  Unsupported = 'unsupported',
}

export type SwappableChainType = {
  /** Unique chain id */
  chainId: SwappableChainId
  name: string
  evmChainId?: number
  isMainnet?: boolean
  type: SupportedChainType
}

export type CommonSwappableAssetType = {
  name: string
  symbol: string
  decimals: number
  contractAddress?: string
  chainId: SwappableChainId
}

export type ChainflipSwappableAsset = CommonSwappableAssetType & {
  protocol: SupportedSwapProtocol.chainflip
  data: AssetData
}

export type SwappableAssetType = ChainflipSwappableAsset
