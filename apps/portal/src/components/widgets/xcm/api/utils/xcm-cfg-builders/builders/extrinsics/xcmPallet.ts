// @ts-nocheck

import { ExtrinsicConfig, ExtrinsicConfigBuilder, Parachain } from '@galacticcouncil/xcm-core'

import { getExtrinsicAccount } from '../ExtrinsicBuilder.utils'
import { Parents, XcmVersion } from '../types'
import { toAssets, toBeneficiary, toDest } from './xcmPallet.utils'

const pallet = 'xcmPallet'

const limitedReserveTransferAssets = (parent: Parents) => {
  const func = 'limitedReserveTransferAssets'
  return {
    here: (): ExtrinsicConfigBuilder => ({
      build: ({ address, amount, destination }) =>
        new ExtrinsicConfig({
          module: pallet,
          func,
          getArgs: () => {
            const version = XcmVersion.v3
            const rcv = destination.chain as Parachain
            const account = getExtrinsicAccount(address)
            return [
              toDest(version, rcv),
              toBeneficiary(version, account),
              toAssets(version, parent, 'Here', amount),
              0,
              'Unlimited',
            ]
          },
        }),
    }),
  }
}

const limitedTeleportAssets = (parent: Parents) => {
  const func = 'limitedTeleportAssets'
  return {
    here: (): ExtrinsicConfigBuilder => ({
      build: ({ address, amount, destination }) =>
        new ExtrinsicConfig({
          module: pallet,
          func,
          getArgs: () => {
            const version = XcmVersion.v3
            const rcv = destination.chain as Parachain
            const account = getExtrinsicAccount(address)
            return [
              toDest(version, rcv),
              toBeneficiary(version, account),
              toAssets(version, parent, 'Here', amount),
              0,
              'Unlimited',
            ]
          },
        }),
    }),
  }
}

export const xcmPallet = () => {
  return {
    limitedReserveTransferAssets,
    limitedTeleportAssets,
  }
}
