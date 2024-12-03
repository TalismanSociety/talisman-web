// @ts-nocheck

import { EvmParachain, ExtrinsicConfig, ExtrinsicConfigBuilder } from '@galacticcouncil/xcm-core'

const pallet = 'router'

type SwapOpts = {
  withSlippage: number
}

const buy = (opts: SwapOpts): ExtrinsicConfigBuilder => {
  const func = 'buy'
  return {
    build: ({ source }) =>
      new ExtrinsicConfig({
        module: pallet,
        func,
        getArgs: () => {
          const { chain, feeSwap } = source

          const { aIn, aOut, route } = feeSwap!

          const ctx = chain as EvmParachain
          const assetIn = ctx.getMetadataAssetId(aIn)
          const assetOut = ctx.getMetadataAssetId(aOut)

          const amountOut = aOut.amount
          const maxAmountIn = aIn.amount + (aIn.amount * BigInt(opts.withSlippage)) / 100n

          return [assetIn, assetOut, amountOut, maxAmountIn, route]
        },
      }),
  }
}

export const router = () => {
  return {
    buy,
  }
}
