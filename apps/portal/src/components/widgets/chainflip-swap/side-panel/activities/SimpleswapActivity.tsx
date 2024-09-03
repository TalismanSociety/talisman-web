import { simpleswapSwapStatusAtom } from '../../swap-modules/simpleswap-swap-module'
import { fromAssetsAtom } from '../../swaps.api'
import { Decimal } from '@talismn/math'
import { CircularProgressIndicator, SurfaceButton } from '@talismn/ui'
import { useAtomValue } from 'jotai'
import { ArrowRight, ArrowUpRight, Check, X } from 'lucide-react'
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

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
        <SurfaceButton className="!rounded-[8px] min-h-[56px] !w-full [&>div]:!justify-start [&>div>span]:!w-full !px-[8px] py-[12px]">
          <div className="flex items-center justify-between w-full h-full">
            <div className="text-left">
              <div className="flex items-center gap-[4px]">
                <span className="text-white text-[14px] font-semibold">??</span>
                <ArrowRight className="text-gray-600" size={16} />
                <span className="text-white text-[14px] font-semibold">??</span>
              </div>
              <p className="text-gray-400 text-[12px] !leading-none">{new Date(timestamp).toLocaleString()}</p>
            </div>
            <ArrowUpRight className="text-primary" size={20} />
          </div>
        </SurfaceButton>
      </Link>
    )
  }

  return (
    <Link to={`https://simpleswap.io/exchange?id=${data.id}`} target="_blank">
      <SurfaceButton className="!rounded-[8px] min-h-[56px] !w-full [&>div]:!justify-start [&>div>span]:!w-full !px-[8px] py-[12px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <div className="flex items-center min-w-max">
              {fromAsset && (
                <img src={fromAsset.image} className="w-[32px] h-[32px] border-2 border-gray-800 rounded-full" />
              )}
              {destAsset && (
                <img
                  src={destAsset.image}
                  className="w-[32px] h-[32px] min-w-[32px] -ml-[12px] border-2 border-gray-800 rounded-full"
                />
              )}
            </div>
            <div>
              <div className="flex items-center gap-[4px]">
                <span className="text-white text-[14px] font-semibold">
                  {fromAmount} {fromAsset?.symbol}
                </span>
                <ArrowRight className="text-gray-600" size={16} />
                <span className="text-white text-[14px] font-semibold">
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
                <p className="text-gray-400 text-[12px] !leading-none">
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
