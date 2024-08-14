import { BaseQuote, selectedProtocolAtom, toAssetAtom } from '../../swap-modules/common.swap-module'
import chainflipLogo from './logos/chainflip-logo.png'
import simpleSwapLogo from './logos/simpleswap-logo.svg'
import { selectedCurrencyState } from '@/domains/balances'
import { cn } from '@/lib/utils'
import { useTokenRates } from '@talismn/balances-react'
import { Decimal } from '@talismn/math'
import { Clickable, Surface } from '@talismn/ui'
import { intervalToDuration } from 'date-fns'
import { useAtomValue, useSetAtom } from 'jotai'
import React, { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

type Props = {
  quote: BaseQuote & { decentralisationScore: number }
  amountOverride?: bigint
}

const DecentralisationScore: React.FC<{ score: number }> = ({ score }) => {
  return (
    <div className="flex items-end gap-[2px]">
      <div
        className={cn('w-[4px] rounded-[2px] h-[6px] bg-gray-600', {
          'bg-[#FD4848]': score > 0,
          'bg-primary': score > 1,
        })}
      />
      <div
        className={cn('w-[4px] rounded-[2px] h-[9px] bg-gray-600', {
          'bg-primary': score > 1,
        })}
      />
      <div className={cn('w-[4px] rounded-[2px] h-[12px] bg-gray-600')} />
    </div>
  )
}
export const SwapDetailsCard: React.FC<Props & { selected?: boolean }> = ({ selected, amountOverride, quote }) => {
  const toAsset = useAtomValue(toAssetAtom)
  const tokenRates = useTokenRates()
  const currency = useRecoilValue(selectedCurrencyState)
  const setSelectedProtocol = useSetAtom(selectedProtocolAtom)

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
        className={cn('rounded-[8px] p-[12px]', {
          'border-white border': selected,
        })}
      >
        <div className="flex items-center justify-between w-full mb-[16px]">
          <p className="font-bold text-[14px]">
            {amount?.toLocaleString()}{' '}
            <span className="font-normal text-[12px] text-muted-foreground">
              ~ {usdValue?.toLocaleString(undefined, { style: 'currency', currency })}
            </span>
          </p>
          {brand}
        </div>
        <div className="flex items-center gap-[12px]">
          <div className="flex items-center gap-[4px]">
            <p className="text-[12px] leading-[12px] pt-[4px] text-muted-foreground">Fee</p>
            <p className="text-[12px] leading-[12px] pt-[4px]">~{totalFee}</p>
          </div>
          <div className="flex items-center gap-[4px]">
            <p className="text-[12px] leading-[12px] pt-[4px] text-muted-foreground">Time</p>
            <p className="text-[12px] leading-[12px] pt-[4px]">~{time}</p>
          </div>
          <div className="flex items-center gap-[4px]">
            <p className="text-[12px] leading-[12px] pt-[4px] text-muted-foreground">Decentralization</p>
            <DecentralisationScore score={quote.decentralisationScore} />
          </div>
        </div>
      </Surface>
    </Clickable.WithFeedback>
  )
}
