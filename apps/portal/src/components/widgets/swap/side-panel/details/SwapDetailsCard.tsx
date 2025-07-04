import { useTokenRates, useTokens } from '@talismn/balances-react'
import { Clickable } from '@talismn/ui/atoms/Clickable'
import { Surface } from '@talismn/ui/atoms/Surface'
import { Tooltip } from '@talismn/ui/atoms/Tooltip'
import BigNumber from 'bignumber.js'
import { intervalToDuration } from 'date-fns'
import { useAtomValue, useSetAtom } from 'jotai'
import { Clock, Info } from 'lucide-react'
import React, { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import { selectedCurrencyState } from '@/domains/balances/currency'
import { useTokenRatesFromUsd } from '@/hooks/useTokenRatesFromUsd'
import { cn } from '@/util/cn'
import { Decimal } from '@/util/Decimal'

import {
  BaseQuote,
  fromAmountAtom,
  fromAssetAtom,
  selectedProtocolAtom,
  selectedSubProtocolAtom,
  toAssetAtom,
} from '../../swap-modules/common.swap-module'

type Props = {
  quote: BaseQuote
  amountOverride?: bigint
}

export const SwapDetailsCard: React.FC<Props & { selected?: boolean }> = ({ selected, amountOverride, quote }) => {
  const toAsset = useAtomValue(toAssetAtom)
  const fromAsset = useAtomValue(fromAssetAtom)
  const tokenRates = useTokenRates()
  const currency = useRecoilValue(selectedCurrencyState)
  const setSelectedProtocol = useSetAtom(selectedProtocolAtom)
  const setSelectedSubProtocol = useSetAtom(selectedSubProtocolAtom)
  const fromAmount = useAtomValue(fromAmountAtom)
  const tokens = useTokens()

  const amount = useMemo(() => {
    if (!toAsset) return null
    return Decimal.fromPlanck(amountOverride ?? quote.outputAmountBN, toAsset.decimals, { currency: toAsset.symbol })
  }, [amountOverride, quote.outputAmountBN, toAsset])

  const usdOverride = useMemo(() => {
    switch (quote.protocol) {
      case 'lifi':
        return quote.data?.toAmountUSD
      default:
        return null
    }
  }, [quote.data?.toAmountUSD, quote.protocol])

  const fiatOverride = useTokenRatesFromUsd(usdOverride)

  const bestGuessRate = useMemo(() => {
    if (!toAsset) return null
    const confirmedRate = tokenRates[toAsset.id]
    if (confirmedRate) return confirmedRate
    return Object.entries(tokenRates ?? {}).find(([id]) => tokens[id]?.symbol === toAsset.symbol)?.[1]
  }, [toAsset, tokenRates, tokens])

  const fiatValue = useMemo(() => {
    if (!bestGuessRate || !amount) return fiatOverride?.[currency]
    return (bestGuessRate[currency]?.price ?? 0) * amount.toNumber()
  }, [amount, bestGuessRate, currency, fiatOverride])

  const time = useMemo(() => {
    const duration = intervalToDuration({ start: 0, end: quote.timeInSec * 1000 })
    const parts: string[] = []
    if (duration.minutes && duration.minutes > 0) parts.push(`${duration.minutes}m`)
    if (duration.seconds && duration.seconds > 0) parts.push(`${duration.seconds}s`)
    return parts.join(' ')
  }, [quote.timeInSec])

  const toQuote = useMemo(() => {
    if (!amount || !fromAmount) return undefined
    return amount.mapNumber(() => {
      const res = (amount.toNumber() ?? 0) / (fromAmount.toNumber() ?? 1)
      if (res < 0.0001) return 0
      return res
    })
  }, [fromAmount, amount])

  const totalFee = useMemo(
    () =>
      quote.fees
        .reduce((acc, fee) => {
          const rate = tokenRates[fee.tokenId]?.[currency]?.price ?? 0
          return acc.plus(fee.amount.times(rate))
        }, BigNumber(0))
        .toNumber()
        .toLocaleString(undefined, { style: 'currency', currency, maximumSignificantDigits: 3 }),
    [currency, quote.fees, tokenRates]
  )

  if (!toAsset) return null

  return (
    <Clickable.WithFeedback
      onClick={() => {
        setSelectedProtocol(quote.protocol)
        setSelectedSubProtocol(quote.subProtocol)
      }}
    >
      <Surface
        className={cn('rounded-[8px] p-[12px] pb-[8px]', {
          'border border-white': selected,
        })}
      >
        <div className="flex w-full items-center justify-between ">
          <p className="truncate text-[14px] font-bold">
            {amount?.toLocaleString(undefined, { maximumFractionDigits: 4 })}{' '}
          </p>
          <div className="flex items-center justify-end gap-[8px]">
            <img src={quote.providerLogo} className="mb-[2px] h-[20px] rounded-full" />
            <p className="max-w-60 truncate text-[12px] font-semibold">{quote.providerName}</p>
          </div>
        </div>
        <div className="text-muted-foreground mb-[16px] flex items-center gap-[8px]">
          <p className="text-[12px] font-normal">
            {(fiatValue ?? 0)?.toLocaleString(undefined, { style: 'currency', currency })}
          </p>
          <Tooltip
            content={
              <p className="max-w-[240px] text-[14px]">
                This is the estimated amount, including the provider costs for exchange liquidity, gas fees, provider
                rates and a {((quote.talismanFee ?? 0.0) * 100).toFixed(2)}% Talisman fee on this path.
              </p>
            }
            placement="top"
          >
            <Info className="h-[14px] w-[14px]" />
          </Tooltip>
        </div>

        <div className="mt-[12px] flex items-center gap-[12px] border-t border-t-[#3f3f3f] pt-[8px]">
          <div className="flex items-center gap-[12px]">
            <p className="text-[12px] leading-[12px]">
              1 {fromAsset?.symbol} ={' '}
              {toQuote?.toLocaleString(undefined, {
                maximumFractionDigits: toQuote.toNumber() > 100 ? 0 : 4,
                compactDisplay: 'short',
                notation: 'compact',
              })}
            </p>
            <p className="text-muted-foreground text-[12px] leading-[12px]">
              Fees <span className="text-[12px] leading-[12px] text-white">~{totalFee}</span>
            </p>
          </div>

          <div className="ml-auto flex items-center gap-[4px]">
            <Clock className="text-muted-foreground h-[14px] w-[14px]" />
            <p className="text-[12px] leading-[12px]">{time}</p>
          </div>
        </div>
      </Surface>
    </Clickable.WithFeedback>
  )
}
