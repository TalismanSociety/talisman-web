import { Parachain, TxWeight } from '@galacticcouncil/xcm-core'

import { Parents, XcmVersion } from '../types'

export const toDest = (version: XcmVersion, destination: Parachain) => {
  if (destination.key === 'polkadot' || destination.key === 'kusama') {
    return {
      [version]: {
        parents: 1,
        interior: 'Here',
      },
    }
  }

  return {
    [version]: {
      parents: 1,
      interior: {
        X1: { Parachain: destination.parachainId },
      },
    },
  }
}

export const toBeneficiary = (version: XcmVersion, account: any) => {
  return {
    [version]: {
      parents: 0,
      interior: {
        X1: account,
      },
    },
  }
}

export const toAssets = (version: XcmVersion, parents: Parents, interior: any, amount: any) => {
  return {
    [version]: [
      {
        id: {
          Concrete: {
            parents: parents,
            interior: interior,
          },
        },
        fun: {
          Fungible: amount,
        },
      },
    ],
  }
}

export const toRemoteFeesId = (version: XcmVersion, parents: Parents, interior: any) => {
  return {
    [version]: {
      Concrete: {
        parents: parents,
        interior: interior,
      },
    },
  }
}

export const toAsset = (parents: Parents, interior: any, amount: any) => {
  return {
    id: {
      Concrete: {
        parents: parents,
        interior: interior,
      },
    },
    fun: {
      Fungible: amount,
    },
  }
}

export const toCustomXcmOnDest = (version: XcmVersion, account: any) => {
  return {
    [version]: [
      {
        DepositAsset: {
          assets: { Wild: { AllCounted: 1 } },
          beneficiary: {
            parents: 0,
            interior: {
              X1: account,
            },
          },
        },
      },
    ],
  }
}

export const toTransactMessage = (
  version: XcmVersion,
  account: any,
  interior: any,
  transactCall: `0x${string}`,
  transactWeight: TxWeight,
  amount: any
) => {
  return {
    [version]: [
      {
        // Withdraw fee asset from the target account
        WithdrawAsset: [
          {
            id: {
              Concrete: {
                parents: 0,
                interior: interior,
              },
            },
            fun: { Fungible: amount },
          },
        ],
      },
      {
        // Buy execution with the fee asset
        BuyExecution: {
          fees: {
            id: {
              Concrete: {
                parents: 0,
                interior: interior,
              },
            },
            fun: { Fungible: amount },
          },
          weightLimit: 'Unlimited',
        },
      },
      {
        Transact: {
          originKind: 'SovereignAccount',
          requireWeightAtMost: transactWeight,
          call: {
            encoded: transactCall,
          },
        },
      },
      {
        RefundSurplus: {},
      },
      {
        DepositAsset: {
          assets: { Wild: { AllCounted: 1 } },
          beneficiary: {
            parents: 0,
            interior: {
              X1: account,
            },
          },
        },
      },
    ],
  }
}
