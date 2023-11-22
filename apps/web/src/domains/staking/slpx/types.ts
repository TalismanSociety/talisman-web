import type { Chain } from 'wagmi'

export type SlpxToken = {
  type: 'token' | 'vToken'
  address: `0x${string}`
  symbol: string
  coingeckoId: string
  tokenId: any
}

export type SlpxPair = {
  chain: Chain
  splx: `0x${string}`
  nativeToken: SlpxToken
  vToken: SlpxToken
  etherscanUrl: string
}
