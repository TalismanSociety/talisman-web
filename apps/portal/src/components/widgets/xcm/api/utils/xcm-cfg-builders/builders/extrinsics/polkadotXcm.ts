// @ts-nocheck
/* eslint-disable */

import { acc, big, ExtrinsicConfig, ExtrinsicConfigBuilder, Parachain } from '@galacticcouncil/xcm-core'

import { getExtrinsicAccount, getExtrinsicArgumentVersion } from '../ExtrinsicBuilder.utils'
import { Parents, XcmVersion } from '../types'
import { toAsset, toAssets, toBeneficiary, toDest, toTransactMessage } from './polkadotXcm.utils'

const pallet = 'polkadotXcm'

const limitedReserveTransferAssets = (parents: Parents = 0) => {
  const func = 'limitedReserveTransferAssets'
  return {
    here: (): ExtrinsicConfigBuilder => ({
      build: ({ address, amount, destination }) =>
        new ExtrinsicConfig({
          module: pallet,
          func,
          getArgs: ext => {
            const version = getExtrinsicArgumentVersion(ext)
            const account = getExtrinsicAccount(address)
            const rcv = destination.chain as Parachain
            return [
              toDest(version, rcv),
              toBeneficiary(version, account),
              toAssets(version, parents, 'Here', amount),
              0,
              'Unlimited',
            ]
          },
        }),
    }),
    X2: (): ExtrinsicConfigBuilder => ({
      build: ({ address, amount, asset, destination, source }) =>
        new ExtrinsicConfig({
          module: pallet,
          func,
          getArgs: () => {
            const version = XcmVersion.v3
            const account = getExtrinsicAccount(address)
            const ctx = source.chain as Parachain
            const rcv = destination.chain as Parachain
            const assetId = ctx.getAssetId(asset)
            const palletInstance = ctx.getAssetPalletInstance(asset)
            const assets = [
              toAsset(
                0,
                {
                  X2: [
                    {
                      PalletInstance: palletInstance,
                    },
                    {
                      GeneralIndex: assetId,
                    },
                  ],
                },
                amount
              ),
            ]

            if (asset.key === destination.fee.key) {
              return [
                toDest(version, rcv),
                toBeneficiary(version, account),
                {
                  [version]: assets,
                },
                0,
                'Unlimited',
              ]
            }

            const feeAssetId = ctx.getAssetId(destination.fee)
            assets.push(
              toAsset(
                0,
                {
                  X2: [
                    {
                      PalletInstance: palletInstance,
                    },
                    {
                      GeneralIndex: feeAssetId,
                    },
                  ],
                },
                destination.fee.amount
              )
            )

            // Flip asset order if general index greater than fee asset
            if (Number(assetId) > Number(feeAssetId)) {
              return [
                toDest(version, rcv),
                toBeneficiary(version, account),
                {
                  [version]: assets.reverse(),
                },
                0,
                'Unlimited',
              ]
            }

            return [
              toDest(version, rcv),
              toBeneficiary(version, account),
              {
                [version]: assets,
              },
              1,
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
            const version = XcmVersion.v2
            const account = getExtrinsicAccount(address)
            const rcv = destination.chain as Parachain
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

const reserveTransferAssets = () => {
  const func = 'reserveTransferAssets'
  return {
    here: (): ExtrinsicConfigBuilder => ({
      build: ({ address, amount, destination }) =>
        new ExtrinsicConfig({
          module: pallet,
          func,
          getArgs: () => {
            const version = XcmVersion.v3
            const account = getExtrinsicAccount(address)
            const rcv = destination.chain as Parachain
            return [toDest(version, rcv), toBeneficiary(version, account), toAssets(version, 0, 'Here', amount), 0]
          },
        }),
    }),
  }
}

const teleportAssets = (parent: Parents) => {
  const func = 'teleportAssets'
  return {
    here: (): ExtrinsicConfigBuilder => ({
      build: ({ address, amount, destination }) =>
        new ExtrinsicConfig({
          module: pallet,
          func,
          getArgs: () => {
            const version = XcmVersion.v3
            const account = getExtrinsicAccount(address)
            const rcv = destination.chain as Parachain
            return [toDest(version, rcv), toBeneficiary(version, account), toAssets(version, parent, 'Here', amount), 0]
          },
        }),
    }),
  }
}

type TransactOpts = {
  fee: number
}

const send = () => {
  const func = 'send'
  return {
    transact: (opts: TransactOpts): ExtrinsicConfigBuilder => ({
      build: params => {
        const { sender, source, transact } = params
        return new ExtrinsicConfig({
          module: pallet,
          func,
          getArgs: () => {
            if (!transact) {
              throw new Error('Transact ctx configuration is missing.')
            }

            const version = XcmVersion.v3
            const ctx = source.chain as Parachain
            const rcv = transact.chain as Parachain
            const mda = acc.getMultilocationDerivatedAccount(ctx.parachainId, sender, 1)
            const account = getExtrinsicAccount(mda)

            const { fee } = transact
            const feePalletInstance = ctx.getAssetPalletInstance(fee)
            const feeAmount = big.toBigInt(opts.fee, fee.decimals)

            return [
              toDest(version, rcv),
              toTransactMessage(
                version,
                account,
                { X1: { PalletInstance: feePalletInstance } },
                transact.call,
                transact.weight,
                feeAmount
              ),
            ]
          },
        })
      },
    }),
  }
}

export const polkadotXcm = () => {
  return {
    limitedReserveTransferAssets,
    limitedTeleportAssets,
    reserveTransferAssets,
    teleportAssets,
    send,
  }
}
