import {
  CHAINFLIP_COMMISSION_BPS,
  chainflipAssetsAtom,
  chainflipAssetToSwappableAsset,
  chainflipChainsAtom,
} from '../../swap-modules/chainflip.swap-module'
import {
  fromAmountAtom,
  fromAssetAtom,
  getTokenIdForSwappableAsset,
  toAssetAtom,
} from '../../swap-modules/common.swap-module'
import { toAmountAtom } from '../../swaps.api'
import { selectedCurrencyState } from '@/domains/balances'
import { type QuoteResponse } from '@chainflip/sdk/swap'
import { useTokenRates, useTokens } from '@talismn/balances-react'
import { githubUnknownTokenLogoUrl } from '@talismn/chaindata-provider'
import { Decimal } from '@talismn/math'
import { Skeleton, Tooltip } from '@talismn/ui'
import { ArrowRight, Info } from '@talismn/web-icons'
import { useAtomValue } from 'jotai'
import { loadable } from 'jotai/utils'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

export const ChainflipDetails: React.FC<{ data: QuoteResponse; gas: Decimal | null }> = ({ data, gas }) => {
  const chainflipAssets = useAtomValue(chainflipAssetsAtom)
  const chainflipChains = useAtomValue(chainflipChainsAtom)
  const currency = useRecoilValue(selectedCurrencyState)
  const fromAsset = useAtomValue(fromAssetAtom)
  const toAsset = useAtomValue(toAssetAtom)
  const fromAmount = useAtomValue(fromAmountAtom)
  const toAmount = useAtomValue(loadable(toAmountAtom))
  const rates = useTokenRates()
  const tokens = useTokens()

  const gasValue = useMemo(() => {
    if (gas === null || !fromAsset) return null
    const id = getTokenIdForSwappableAsset(fromAsset.chainId === 'polkadot' ? 'substrate' : 'evm', fromAsset?.chainId)
    const rate = rates[id]?.[currency] ?? 0

    return +gas.toNumber() * rate
  }, [currency, fromAsset, gas, rates])

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
          <p className="text-gray-400 text-[14px]">Est. Rate</p>
          <p className="text-[14px] text-white">
            {fromAmount.mapNumber(() => 1).toLocaleString()} = {toQuote?.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-[14px]">Included Fees (est.)</p>
          <Tooltip
            placement="left"
            content={
              <div className="max-w-[240px]">
                <p className="text-[14px]">
                  This is the estimated cost of making the swap, including the provider costs for exchange liquidity,
                  gas fees on destination chain, provider rates, and a {CHAINFLIP_COMMISSION_BPS / 100}% Talisman fee on
                  this path.
                </p>
              </div>
            }
          >
            <div className="flex items-center justify-end gap-[8px]">
              <p className="text-[14px] text-white">
                {totalFiatFee.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  currency,
                  style: 'currency',
                })}
              </p>
              <Info size={16} className="text-gray-400" />
            </div>
          </Tooltip>
        </div>

        <div className="flex justify-between">
          <p className="text-gray-400 text-[14px]">Gas Fees (est.)</p>
          <div>
            <p className="text-[14px] text-white">
              {gas !== null ? (
                gas.toLocaleString(undefined, { maximumFractionDigits: 6 })
              ) : (
                <Skeleton.Surface className="w-[86px] h-[22px]" />
              )}
            </p>
            {gasValue !== null && (
              <p className="text-gray-400 text-[12px] text-right">
                ({gasValue.toLocaleString(undefined, { maximumFractionDigits: 2, currency, style: 'currency' })})
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
