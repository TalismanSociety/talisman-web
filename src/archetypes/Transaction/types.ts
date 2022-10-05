import { Moment } from 'moment-timezone'

export type IndexerTransaction = {
  id: string
  name: string
  chainId: string
  ss58Format: number
  blockNumber: string
  blockHash: string
  timestamp: string
  args: string
  signer: string
  relatedAddresses: string[]

  _data: string
}

export type TransactionMap = Record<Transaction['id'], Transaction>
export type Transaction = {
  id: string
  name: string
  chainId: string
  ss58Format: number
  blockNumber: string
  blockHash: string
  timestamp: Moment // type is different to IndexerTransaction
  signer: string
  relatedAddresses: string[]

  blockExplorerUrl: string | undefined
  parsed?: ParsedTransaction | null

  _data: string
}

export type ParsedTransaction =
  | ParsedTransfer
  | ParsedCrowdloanContribute
  | ParsedStake
  | ParsedUnstake
  // | ParsedAddLiquidity
  // | ParsedRemoveLiquidity
  // | ParsedAddProvision
  // | ParsedRemoveProvision
  | ParsedSwap
export type ParsedTransactionType = ParsedTransaction['type']

export type ParsedTransfer = {
  type: 'transfer'

  // source: event
  chainId: string
  // source: tba (hardcoded for now)
  tokenSymbol: string
  // source: tba (hardcoded for now)
  tokenDecimals: number
  // source: event
  from: string
  // source: event
  to: string
  // source: event
  amount: string
  // source: extrinsic
  fee: string | undefined
  // source: extrinsic
  tip: string | undefined
  // source: extrinsic
  success: boolean
}

export type ParsedCrowdloanContribute = {
  type: 'contribute'

  // source: event
  chainId: string
  // source: tba (hardcoded for now)
  tokenSymbol: string
  // source: tba (hardcoded for now)
  tokenDecimals: number
  // source: event
  contributor: string
  // source: event
  amount: string
  // TODO: look up fund info (e.g. parachain name)
  // source: event
  fund: number
  // source: extrinsic
  fee: string | undefined
  // source: extrinsic
  tip: string | undefined
  // source: extrinsic
  success: boolean
}

export type ParsedStake = {
  type: 'stake'

  // source: event
  chainId: string
  // source: tba (hardcoded for now)
  tokenSymbol: string
  // source: tba (hardcoded for now)
  tokenDecimals: number
  // source: event
  staker: string
  // source: event
  amount: string
  // source: extrinsic
  fee: string | undefined
  // source: extrinsic
  tip: string | undefined
  // source: extrinsic
  success: boolean
}

export type ParsedUnstake = {
  type: 'unstake'

  // source: event
  chainId: string
  // source: tba (hardcoded for now)
  tokenSymbol: string
  // source: tba (hardcoded for now)
  tokenDecimals: number
  // source: event
  unstaker: string
  // source: event
  amount: string
  // source: extrinsic
  fee: string | undefined
  // source: extrinsic
  tip: string | undefined
  // source: extrinsic
  success: boolean
}

// export type ParsedAddLiquidity = {
//   type: 'add liquidity'
// }
// export type ParsedRemoveLiquidity = {
//   type: 'remove liquidity'
// }

// export type ParsedAddProvision = {
//   type: 'add provision'
// }
// export type ParsedRemoveProvision = {
//   type: 'remove provision'
// }

export type ParsedSwap = {
  type: 'swap'

  // source: event
  chainId: string
  // source: tba (hardcoded for now)
  tokenSymbol: string
  // source: tba (hardcoded for now)
  tokenDecimals: number
  // source: extrinsic
  fee: string | undefined
  // source: extrinsic
  tip: string | undefined
  // source: extrinsic
  success: boolean
}
