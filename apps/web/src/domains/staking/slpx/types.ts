export type SlpxToken = {
  type: 'token' | 'vToken'
  address: `0x${string}`
  symbol: string
  coingeckoId: string
  tokenId: any
}

export type SlpxPair = {
  chainId: number
  splx: `0x${string}`
  nativeToken: SlpxToken
  vToken: SlpxToken
  etherscanUrl: string
}