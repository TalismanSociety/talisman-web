// @ts-nocheck
/* eslint-disable */

import { ExtrinsicConfig, ExtrinsicConfigBuilder, Parachain } from '@galacticcouncil/xcm-core'

import { getExtrinsicAccount, getExtrinsicAssetLocation } from '../../ExtrinsicBuilder.utils'
import { XcmTransferType, XcmVersion } from '../../types'
import { toAsset, toBeneficiary, toBridgeXcmOnDest, toDest, toParaXcmOnDest, toTransferType } from './polkadotXcm.utils'

const pallet = 'polkadotXcm'

const limitedTeleportAssets = (): ExtrinsicConfigBuilder => ({
  build: ({ address, amount, asset, destination, source }) =>
    new ExtrinsicConfig({
      module: pallet,
      func: 'limitedTeleportAssets',
      getArgs: () => {
        const version = XcmVersion.v4
        const account = getExtrinsicAccount(address)
        const ctx = source.chain as Parachain
        const rcv = destination.chain as Parachain

        const transferAssetLocation = getExtrinsicAssetLocation(ctx.getAssetXcmLocation(asset)!, version)
        const transferAsset = toAsset(transferAssetLocation, amount)

        const dest = toDest(version, rcv)
        const beneficiary = toBeneficiary(version, account)
        const assets = {
          [version]: [transferAsset],
        }
        return [dest, beneficiary, assets, 0, 'Unlimited']
      },
    }),
})

type TransferOpts = {
  transferType: XcmTransferType
}

const transferAssetsUsingTypeAndThen = (opts: TransferOpts): ExtrinsicConfigBuilder => ({
  build: ({ address, asset, amount, destination, sender, source }) =>
    new ExtrinsicConfig({
      module: pallet,
      func: 'transferAssetsUsingTypeAndThen',
      getArgs: () => {
        const version = XcmVersion.v4
        const from = getExtrinsicAccount(sender)
        const account = getExtrinsicAccount(address)
        const ctx = source.chain as Parachain
        const rcv = destination.chain as Parachain

        const { transferType } = opts

        const transferAssetLocation = getExtrinsicAssetLocation(ctx.getAssetXcmLocation(asset)!, version)
        const transferFeeLocation = getExtrinsicAssetLocation(ctx.getAssetXcmLocation(destination.fee)!, version)

        const transferAsset = toAsset(transferAssetLocation, amount)
        const transferFee = toAsset(transferFeeLocation, destination.fee.amount)

        const isSufficientPaymentAsset = asset.isEqual(destination.fee)

        const dest = toDest(version, rcv)

        const assets = {
          [version]: asset.isEqual(destination.fee) ? [transferAsset] : [transferFee, transferAsset],
        }

        const assetTransferType = toTransferType(version, transferType, transferAssetLocation)

        const remoteFeeId = {
          [version]: isSufficientPaymentAsset ? transferAssetLocation : transferFeeLocation,
        }

        const feesTransferType = toTransferType(version, transferType, transferFeeLocation)

        const customXcmOnDest =
          destination.chain.key === 'ethereum'
            ? toBridgeXcmOnDest(version, account, from, transferAssetLocation)
            : toParaXcmOnDest(version, account)

        return [dest, assets, assetTransferType, remoteFeeId, feesTransferType, customXcmOnDest, 'Unlimited']
      },
    }),
})

export const polkadotXcm = () => {
  return {
    limitedTeleportAssets,
    transferAssetsUsingTypeAndThen,
  }
}
