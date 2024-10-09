export type SlpxSubstrateToken = {
  type: 'token' | 'vToken'
  address: string
  symbol: string
  logo: string
  coingeckoId: string
  tokenId: any
}

export type SlpxSubstratePair = {
  chainName: string
  chainId: string
  substrateChainGenesisHash: `0x${string}`
  splx: string
  nativeToken: SlpxSubstrateToken
  vToken: SlpxSubstrateToken
  apiEndpoint: string
  estimatedRoundDuration: number
  minStake: bigint
  minRedeem: bigint
}
