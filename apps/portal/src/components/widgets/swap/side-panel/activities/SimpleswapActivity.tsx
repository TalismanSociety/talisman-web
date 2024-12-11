import { CircularProgressIndicator, SurfaceButton } from '@talismn/ui'
import { useAtomValue } from 'jotai'
import { ArrowRight, ArrowUpRight, Check, X } from 'lucide-react'
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { Decimal } from '@/util/Decimal'

import { simpleswapSwapStatusAtom } from '../../swap-modules/simpleswap-swap-module'
import { fromAssetsAtom } from '../../swaps.api'

export const SimpleswapActivity: React.FC<{ data: { id: string }; timestamp: number }> = ({ data, timestamp }) => {
  const status = useAtomValue(simpleswapSwapStatusAtom(data.id))
  const assets = useAtomValue(fromAssetsAtom)

  const fromAsset = useMemo(() => {
    return assets.find(asset => asset.context.simpleswap.symbol === status.exchange.currency_from)
  }, [assets, status.exchange.currency_from])

  const destAsset = useMemo(() => {
    return assets.find(asset => asset.context.simpleswap.symbol === status.exchange.currency_to)
  }, [assets, status.exchange.currency_to])

  const fromAmount = useMemo(() => {
    if (!fromAsset) return status.exchange.amount_from
    return Decimal.fromUserInput(status.exchange.amount_from, fromAsset.decimals).toLocaleString()
  }, [fromAsset, status.exchange.amount_from])

  const toAmount = useMemo(() => {
    if (!destAsset) return status.exchange.amount_to
    return Decimal.fromUserInput(status.exchange.amount_to, destAsset.decimals).toLocaleString()
  }, [destAsset, status.exchange.amount_to])

  if (status.exchange.error) {
    return (
      <Link to={`https://simpleswap.io/exchange?id=${data.id}`} target="_blank">
        <SurfaceButton className="min-h-[56px] !w-full !rounded-[8px] !px-[8px] py-[12px] [&>div>span]:!w-full [&>div]:!justify-start">
          <div className="flex h-full w-full items-center justify-between">
            <div className="text-left">
              <div className="flex items-center gap-[4px]">
                <span className="text-[14px] font-semibold text-white">??</span>
                <ArrowRight className="text-gray-600" size={16} />
                <span className="text-[14px] font-semibold text-white">??</span>
              </div>
              <p className="text-[12px] !leading-none text-gray-400">{new Date(timestamp).toLocaleString()}</p>
            </div>
            <ArrowUpRight className="text-primary" size={20} />
          </div>
        </SurfaceButton>
      </Link>
    )
  }

  return (
    <Link to={`https://simpleswap.io/exchange?id=${data.id}`} target="_blank">
      <SurfaceButton className="min-h-[56px] !w-full !rounded-[8px] !px-[8px] py-[12px] [&>div>span]:!w-full [&>div]:!justify-start">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <div className="flex min-w-max items-center">
              {fromAsset && (
                <img src={fromAsset.image} className="h-[32px] w-[32px] rounded-full border-2 border-gray-800" />
              )}
              {destAsset && (
                <img
                  src={destAsset.image}
                  className="-ml-[12px] h-[32px] w-[32px] min-w-[32px] rounded-full border-2 border-gray-800"
                />
              )}
            </div>
            <div>
              <div className="flex items-center gap-[4px]">
                <span className="text-[14px] font-semibold text-white">
                  {fromAmount} {fromAsset?.symbol}
                </span>
                <ArrowRight className="text-gray-600" size={16} />
                <span className="text-[14px] font-semibold text-white">
                  {toAmount} {destAsset?.symbol}
                </span>
              </div>
              <div className="flex items-center gap-[4px]">
                {status.exchange.status === 'finished' ? (
                  <Check className="text-primary" size={12} />
                ) : status.exchange.status === 'failed' ? (
                  <X className="text-red-500" size={12} />
                ) : (
                  <CircularProgressIndicator size={12} />
                )}
                <p className="text-[12px] !leading-none text-gray-400">
                  {new Date(status.exchange.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <ArrowUpRight className="text-primary" size={20} />
        </div>
      </SurfaceButton>
    </Link>
  )
}
