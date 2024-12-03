// @ts-nocheck
/* eslint-disable */

import { Parachain } from '@galacticcouncil/xcm-core'

import { XcmVersion } from '../types'

export const toDest = (version: XcmVersion, destination: Parachain, account: any) => {
  if (destination.key === 'polkadot' || destination.key === 'kusama') {
    return {
      [version]: {
        parents: 1,
        interior: {
          X1: account,
        },
      },
    }
  }

  return {
    [version]: {
      parents: 1,
      interior: {
        X2: [
          {
            Parachain: destination.parachainId,
          },
          account,
        ],
      },
    },
  }
}

export const toAsset = (interior: any, amount: any) => {
  return {
    id: {
      Concrete: {
        parents: 1,
        interior: interior,
      },
    },
    fun: {
      Fungible: amount,
    },
  }
}
