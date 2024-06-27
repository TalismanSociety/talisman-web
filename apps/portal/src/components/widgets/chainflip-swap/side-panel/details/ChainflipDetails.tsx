import {
  CHAINFLIP_COMMISSION_BPS,
  chainflipAssetsAtom,
  chainflipAssetToSwappableAsset,
  chainflipChainsAtom,
} from '../../swap-modules/chainflip.swap-module'
import { fromAmountAtom, fromAssetAtom, toAssetAtom } from '../../swap-modules/common.swap-module'
import { toAmountAtom } from '../../swaps.api'
import { selectedCurrencyState } from '@/domains/balances'
import { type QuoteResponse } from '@chainflip/sdk/swap'
import { useTokenRates, useTokens } from '@talismn/balances-react'
import { githubUnknownTokenLogoUrl } from '@talismn/chaindata-provider'
import { Decimal } from '@talismn/math'
import { Tooltip } from '@talismn/ui'
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

  const fees = useMemo(() => {
    return data.quote.includedFees
      .map(fee => {
        const chainflipChain = chainflipChains.find(chain => chain.chain === fee.chain)
        const chainflipAsset = chainflipAssets.find(asset => asset.asset === fee.asset)
        if (!chainflipAsset || !chainflipChain) return { name: fee.type.toLowerCase(), rate: 0, fiatAmount: 0 }

        const swappableAsset = chainflipAssetToSwappableAsset(chainflipAsset, chainflipChain)
        if (!swappableAsset) return { name: fee.type.toLowerCase(), rate: 0, fiatAmount: 0 }

        // get rate and compute fee in fiat
        const rate = rates[swappableAsset.id]?.[currency] ?? 0
        const amount = Decimal.fromPlanck(fee.amount, swappableAsset.decimals)
        return { name: fee.type.toLowerCase(), rate, amount, fiatAmount: rate * +amount.toString() }
      })
      .filter(fee => fee !== null)
  }, [chainflipAssets, chainflipChains, currency, data.quote.includedFees, rates])

  const totalFiatFee = useMemo(() => fees.reduce((acc, fee) => acc + fee.fiatAmount, 0), [fees])

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
                  <img
                    src="https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/coingecko/usd-coin.webp"
                    className="w-[20px] h-[20px]"
                  />
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
          <Tooltip
            content={
              <div>
                {fees.map(fee =>
                  fee.name === 'broker' ? null : (
                    <div className="flex items-center justify-between gap-[16px]" key={fee.name}>
                      <p className="text-gray-400 text-[14px] capitalize">{fee.name} Fee</p>
                      <p className="text-[14px] text-white">
                        {fee.fiatAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                          currency,
                          style: 'currency',
                        })}
                      </p>
                    </div>
                  )
                )}
                {!!CHAINFLIP_COMMISSION_BPS && (
                  <div className="flex items-center justify-between gap-[16px]">
                    <p className="text-gray-400 text-[14px]">Service Fee</p>
                    <p className="text-[14px] text-white">{CHAINFLIP_COMMISSION_BPS / 100}%</p>
                  </div>
                )}
              </div>
            }
          >
            <p className="text-[14px] text-white">
              {totalFiatFee.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                currency,
                style: 'currency',
              })}
            </p>
          </Tooltip>
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
