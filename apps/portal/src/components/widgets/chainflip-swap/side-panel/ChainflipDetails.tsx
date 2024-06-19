import { assetIcons } from '../chainflip-config'
import {
  chainflipAssetsAtom,
  chainflipAssetToSwappableAsset,
  chainflipChainsAtom,
} from '../swap-modules/chainflip.swap-module'
import { fromAmountAtom, fromAssetAtom, toAssetAtom } from '../swap-modules/common.swap-module'
import { toAmountAtom } from '../swaps.api'
import { selectedCurrencyState } from '@/domains/balances'
import { type QuoteResponse } from '@chainflip/sdk/swap'
import { useTokenRates, useTokens } from '@talismn/balances-react'
import { githubUnknownTokenLogoUrl } from '@talismn/chaindata-provider'
import { Decimal } from '@talismn/math'
import { ArrowRight } from '@talismn/web-icons'
import { useAtomValue } from 'jotai'
import { loadable } from 'jotai/utils'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

export const ChainflipDetails: React.FC<{ data: QuoteResponse }> = ({ data }) => {
  const chainflipAssets = useAtomValue(chainflipAssetsAtom)
  const chainflipChains = useAtomValue(chainflipChainsAtom)
  const currency = useRecoilValue(selectedCurrencyState)
  const fromAsset = useAtomValue(fromAssetAtom)
  const toAsset = useAtomValue(toAssetAtom)
  const fromAmount = useAtomValue(fromAmountAtom)
  const toAmount = useAtomValue(loadable(toAmountAtom))
  const rates = useTokenRates()
  const tokens = useTokens()

  const toQuote = useMemo(() => {
    if (toAmount.state !== 'hasData' || !fromAmount || !toAmount.data) return undefined
    return toAmount.data.mapNumber(() => (toAmount.data?.toNumber() ?? 0) / (fromAmount.toNumber() ?? 1))
  }, [fromAmount, toAmount])

  const totalFiatFee = useMemo(() => {
    const fees = data.quote.includedFees.map(fee => {
      const chainflipChain = chainflipChains.find(chain => chain.chain === fee.chain)
      const chainflipAsset = chainflipAssets.find(asset => asset.asset === fee.asset)
      if (!chainflipAsset || !chainflipChain) return { fee, rate: 0, fiatAmount: 0 }

      const swappableAsset = chainflipAssetToSwappableAsset(chainflipAsset, chainflipChain)
      if (!swappableAsset) return { fee, rate: 0, fiatAmount: 0 }

      // get rate and compute fee in fiat
      const rate = rates[swappableAsset.id]?.[currency] ?? 0
      const amount = Decimal.fromPlanck(fee.amount, swappableAsset.decimals)
      return { fee, rate, amount, fiatAmount: rate * +amount.toString() }
    })

    return { feesWithRate: fees, total: fees.reduce((acc, fee) => acc + fee.fiatAmount, 0) }
  }, [data.quote.includedFees, chainflipChains, chainflipAssets, rates, currency])

  return (
    <div className="grid gap-[24px]">
      <div className="w-full">
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-[14px]">Route</p>
          {fromAsset && toAsset && (
            <div className="flex items-center justify-end gap-[4px]">
              {fromAsset && (
                <img src={tokens[fromAsset.id]?.logo ?? githubUnknownTokenLogoUrl} className="w-[20px] h-[20px]" />
              )}
              <ArrowRight size={16} className="text-gray-500" />
              {fromAsset.symbol.toUpperCase() !== 'USDC' && toAsset.symbol.toUpperCase() !== 'USDC' && (
                <>
                  <img src={assetIcons.USDC} className="w-[20px] h-[20px]" />
                  <ArrowRight size={16} className="text-gray-500" />
                </>
              )}
              <img src={tokens[toAsset.id]?.logo ?? githubUnknownTokenLogoUrl} className="w-[20px] h-[20px]" />
            </div>
          )}
        </div>
      </div>
      <div className="w-full border-b border-gray-900" />
      <div className="grid gap-[8px]">
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-[14px]">Est. Fees</p>
          <p className="text-[14px] text-white">
            {totalFiatFee?.total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              currency,
              style: 'currency',
            })}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-[14px]">Est. Rate</p>
          <p className="text-[14px] text-white">
            {fromAmount.mapNumber(() => 1).toLocaleString()} = {toQuote?.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}
