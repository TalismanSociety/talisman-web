import {
  BaseQuote,
  fromAmountAtom,
  fromAssetAtom,
  selectedProtocolAtom,
  toAssetAtom,
} from '../../swap-modules/common.swap-module'
import chainflipLogo from './logos/chainflip-logo.png'
import simpleSwapLogo from './logos/simpleswap-logo.svg'
import { selectedCurrencyState } from '@/domains/balances'
import { cn } from '@/lib/utils'
import { useTokenRates } from '@talismn/balances-react'
import { Decimal } from '@talismn/math'
import { Clickable, Surface, Tooltip } from '@talismn/ui'
import { intervalToDuration } from 'date-fns'
import { useAtomValue, useSetAtom } from 'jotai'
import { Clock, Info } from 'lucide-react'
import React, { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

type Props = {
  quote: BaseQuote & { decentralisationScore: number }
  amountOverride?: bigint
}

export const SwapDetailsCard: React.FC<Props & { selected?: boolean }> = ({ selected, amountOverride, quote }) => {
  const toAsset = useAtomValue(toAssetAtom)
  const fromAsset = useAtomValue(fromAssetAtom)
  const tokenRates = useTokenRates()
  const currency = useRecoilValue(selectedCurrencyState)
  const setSelectedProtocol = useSetAtom(selectedProtocolAtom)
  const fromAmount = useAtomValue(fromAmountAtom)

  const amount = useMemo(() => {
    if (!toAsset) return null
    return Decimal.fromPlanck(amountOverride ?? quote.outputAmountBN, toAsset.decimals, { currency: toAsset.symbol })
  }, [amountOverride, quote.outputAmountBN, toAsset])

  const usdValue = useMemo(() => {
    if (!toAsset || !amount) return null
    const rates = tokenRates[toAsset.id]
    return (rates?.[currency] ?? 0) * amount.toNumber()
  }, [amount, currency, toAsset, tokenRates])

  const time = useMemo(() => {
    const duration = intervalToDuration({ start: 0, end: quote.timeInSec * 1000 })
    const parts: string[] = []
    if (duration.minutes && duration.minutes > 0) parts.push(`${duration.minutes}m`)
    if (duration.seconds && duration.seconds > 0) parts.push(`${duration.seconds}s`)
    return parts.join(' ')
  }, [quote.timeInSec])

  const toQuote = useMemo(() => {
    if (!amount || !fromAmount) return undefined
    return amount.mapNumber(() => (amount.toNumber() ?? 0) / (fromAmount.toNumber() ?? 1))
  }, [fromAmount, amount])

  const totalFee = useMemo(
    () =>
      quote.fees
        .reduce((acc, fee) => {
          const rate = tokenRates[fee.tokenId]?.[currency] ?? 0
          return acc + fee.amount.toNumber() * rate
        }, 0)
        .toLocaleString(undefined, { style: 'currency', currency }),
    [currency, quote.fees, tokenRates]
  )

  const brand = useMemo(() => {
    switch (quote.protocol) {
      case 'chainflip':
        return (
          <div className="flex items-center gap-[4px]">
            <img src={chainflipLogo} className="w-[16px] h-[16px] rounded-full" />
            <p className="text-muted-foreground text-[12px]">Chainflip</p>
          </div>
        )
      case 'simpleswap':
        return (
          <div className="flex items-center gap-[4px]">
            <img src={simpleSwapLogo} className="w-[16px] h-[16px] rounded-full" />
            <p className="text-muted-foreground text-[12px]">SimpleSwap</p>
          </div>
        )
      default:
        return null
    }
  }, [quote.protocol])

  if (!toAsset) return null

  return (
    <Clickable.WithFeedback onClick={() => setSelectedProtocol(quote.protocol)}>
      <Surface
        className={cn('rounded-[8px] p-[12px] pb-[8px]', {
          'border-white border': selected,
        })}
      >
        <div className="flex items-center justify-between w-full ">
          <p className="font-bold text-[14px]">{amount?.toLocaleString(undefined, { maximumFractionDigits: 4 })} </p>
          {brand}
        </div>
        <div className="flex items-center gap-[8px] mb-[16px] text-muted-foreground">
          <p className="font-normal text-[12px]">
            {usdValue?.toLocaleString(undefined, { style: 'currency', currency })}
          </p>
          <Tooltip
            content={
              <p className="max-w-[240px] text-[14px]">
                This is the estimated amount, including the provider costs for exchange liquidity, gas fees, provider
                rates and a 1.5% Talisman fee on this path.
              </p>
            }
            placement="top"
          >
            <Info className="w-[14px] h-[14px]" />
          </Tooltip>
        </div>

        <div className="pt-[8px] mt-[12px] border-t border-t-[#3f3f3f] flex items-center gap-[12px]">
          <div className="flex items-center gap-[12px]">
            <p className="text-[12px] leading-[12px]">
              1 {fromAsset?.symbol} = {toQuote?.toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </p>
            <p className="text-[12px] leading-[12px] text-muted-foreground">
              Fees <span className="text-[12px] leading-[12px] text-white">~{totalFee}</span>
            </p>
          </div>

          <div className="flex items-center gap-[4px] ml-auto">
            <Clock className="w-[14px] h-[14px] text-muted-foreground" />
            <p className="text-[12px] leading-[12px]">{time}</p>
          </div>
        </div>
      </Surface>
    </Clickable.WithFeedback>
  )
}
