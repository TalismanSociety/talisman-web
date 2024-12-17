import type { Chain } from 'wagmi/chains'

export type SlpxToken = {
  type: 'token' | 'vToken'
  address: `0x${string}`
  symbol: string
  logo: string
  coingeckoId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export enum mantaPacificOperation {
  Mint,
  Redeem,
}
