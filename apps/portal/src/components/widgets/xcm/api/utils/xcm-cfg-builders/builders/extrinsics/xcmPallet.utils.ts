// @ts-nocheck
/* eslint-disable */

import { Parachain } from '@galacticcouncil/xcm-core'

import { Parents, XcmVersion } from '../types'

export const toDest = (version: XcmVersion, destination: Parachain) => {
  return {
    [version]: {
      parents: 0,
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
