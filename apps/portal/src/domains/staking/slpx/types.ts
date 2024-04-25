import type { Chain } from 'wagmi/chains'

export type SlpxToken = {
  type: 'token' | 'vToken'
  address: `0x${string}`
  symbol: string
  coingeckoId: string
  tokenId: any
}

export type SlpxPair = {
  chain: Chain
  substrateChainGenesisHash: `0x${string}`
  splx: `0x${string}`
  nativeToken: SlpxToken
  vToken: SlpxToken
  etherscanUrl: string
  apiEndpoint: string
  estimatedRoundDuration: number
}
