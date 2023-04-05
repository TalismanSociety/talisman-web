export type ChainParameters = {
  auctionAdjust: number
  auctionMax: number
  falloff: number
  maxInflation: number
  minInflation: number
  stakeTarget: number
}

/**
 * Values from Parity Dashboard
 * https://github.com/paritytech/polkadot-staking-dashboard/blob/8c136141141e6a74ddd838aa20df48a20a35749e/src/config/networks.ts
 */
export const defaultParams: ChainParameters = {
  auctionAdjust: 0,
  auctionMax: 0,
  falloff: 0.05,
  maxInflation: 0.1,
  minInflation: 0.025,
  stakeTarget: 0.5,
}
