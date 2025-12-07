export type SlpxSubstrateToken = {
  /** required for balances to be loaded for this provider's token in the account picker and portfolio totals sections */
  id: string
  type: 'token' | 'vToken'
  address: string
  symbol: string
  logo: string
  coingeckoId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
