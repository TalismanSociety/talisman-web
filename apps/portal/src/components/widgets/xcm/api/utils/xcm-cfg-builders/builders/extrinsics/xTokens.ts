// @ts-nocheck
/* eslint-disable */

import { acc, big, ExtrinsicConfig, ExtrinsicConfigBuilder, Parachain } from '@galacticcouncil/xcm-core'

import { getExtrinsicAccount, getExtrinsicArgumentVersion } from '../ExtrinsicBuilder.utils'
import { XcmVersion } from '../types'
import { toAsset, toDest } from './xTokens.utils'

const pallet = 'xTokens'

const transfer = (): ExtrinsicConfigBuilder => ({
  build: ({ address, amount, asset, destination, source }) =>
    new ExtrinsicConfig({
      module: pallet,
      func: 'transfer',
      getArgs: func => {
        const rcv = destination.chain as Parachain
        const assetId = source.chain.getAssetId(asset)
        const version = getExtrinsicArgumentVersion(func, 2)
        const account = getExtrinsicAccount(address)
        return [assetId, amount, toDest(version, rcv, account), 'Unlimited']
      },
    }),
})

const transferMultiasset = (originParachainId?: number) => {
  return {
    X3: (): ExtrinsicConfigBuilder => ({
      build: ({ address, amount, asset, destination, source }) =>
        new ExtrinsicConfig({
          module: pallet,
          func: 'transferMultiasset',
          getArgs: () => {
            const ctx = source.chain as Parachain
            const rcv = destination.chain as Parachain
            const assetId = ctx.getAssetId(asset)
            const palletInstance = ctx.getAssetPalletInstance(asset)
            const version = XcmVersion.v3
            const account = getExtrinsicAccount(address)
            const assets = toAsset(
              {
                X3: [
                  {
                    Parachain: originParachainId ?? rcv.parachainId,
                  },
                  {
                    PalletInstance: palletInstance,
                  },
                  {
                    GeneralIndex: assetId,
                  },
                ],
              },
              amount
            )
            return [
              {
                [version]: assets,
              },
              toDest(version, rcv, account),
              'Unlimited',
            ]
          },
        }),
    }),
  }
}

const transferMultiassets = (originParachainId?: number) => {
  return {
    X3: (): ExtrinsicConfigBuilder => ({
      build: ({ address, amount, asset, destination, source }) =>
        new ExtrinsicConfig({
          module: pallet,
          func: 'transferMultiassets',
          getArgs: () => {
            const ctx = source.chain as Parachain
            const rcv = destination.chain as Parachain
            const assetId = ctx.getAssetId(asset)
            const palletInstance = ctx.getAssetPalletInstance(asset)
            const version = XcmVersion.v3
            const account = getExtrinsicAccount(address)
            const assets = [
              toAsset(
                {
                  X3: [
                    {
                      Parachain: originParachainId ?? rcv.parachainId,
                    },
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
                {
                  [version]: assets,
                },
                0,
                toDest(version, rcv, account),
                'Unlimited',
              ]
            }

            const feeAssetId = ctx.getAssetId(destination.fee)
            assets.push(
              toAsset(
                {
                  X3: [
                    {
                      Parachain: originParachainId ?? rcv.parachainId,
                    },
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
                {
                  [version]: assets.reverse(),
                },
                0,
                toDest(version, rcv, account),
                'Unlimited',
              ]
            }

            return [
              {
                [version]: assets,
              },
              1,
              toDest(version, rcv, account),
              'Unlimited',
            ]
          },
        }),
    }),
  }
}

const transferMultiCurrencies = (): ExtrinsicConfigBuilder => ({
  build: params =>
    new ExtrinsicConfig({
      module: pallet,
      func: 'transferMulticurrencies',
      getArgs: () => {
        const { address, amount, asset, destination, sender, source, transact } = params

        const ctx = source.chain as Parachain
        let rcv = destination.chain as Parachain
        let receiver = address
        let feeAssetId = source.chain.getAssetId(destination.fee)
        let feeAmount = destination.fee.amount
        if (transact) {
          const { amount, decimals } = transact.fee
          rcv = transact.chain as Parachain
          feeAssetId = source.chain.getAssetId(transact.fee)
          feeAmount = big.toBigInt(amount, decimals)
          receiver = acc.getMultilocationDerivatedAccount(ctx.parachainId, sender, 1)
        }

        const version = XcmVersion.v3
        const assetId = ctx.getAssetId(asset)
        const account = getExtrinsicAccount(receiver)
        return [
          [
            [assetId, amount],
            [feeAssetId, feeAmount],
          ],
          1,
          toDest(version, rcv, account),
          'Unlimited',
        ]
      },
    }),
})

export const xTokens = () => {
  return {
    transfer,
    transferMultiasset,
    transferMultiassets,
    transferMultiCurrencies,
  }
}
