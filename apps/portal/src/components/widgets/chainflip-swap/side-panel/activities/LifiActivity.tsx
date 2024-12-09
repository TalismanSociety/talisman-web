import { ExtendedTransactionInfo } from '@lifi/sdk'
import { SurfaceButton } from '@talismn/ui/atoms/Button'
import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import { useAtomValue } from 'jotai'
import { ArrowRight, ArrowUpRight, Check, X } from 'lucide-react'
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { Decimal } from '@/util/Decimal'

import { lifiSwapStatusAtom } from '../../swap-modules/lifi.swap-module'

export const LifiActivity: React.FC<{ data: { id: string }; timestamp: number }> = ({ data, timestamp }) => {
  const activity = useAtomValue(lifiSwapStatusAtom(data.id))

  const fromAsset = useMemo(() => {
    const { status } = activity
    switch (status.status) {
      case 'FAILED':
      case 'NOT_FOUND':
        return null
      default: {
        const sending = status.sending as ExtendedTransactionInfo
        if (!sending.token) return null
        const amount = sending.amount ? Decimal.fromPlanck(sending.amount, sending.token.decimals) : null
        return {
          logo: sending.token.logoURI,
          symbol: sending.token.symbol,
          amount,
        }
      }
    }
  }, [activity])

  const destAsset = useMemo(() => {
    const { status } = activity
    switch (status.status) {
      case 'FAILED':
      case 'NOT_FOUND':
        return null
      default: {
        const receiving = status.receiving as ExtendedTransactionInfo
        if (!receiving.token) return null
        const amount = receiving.amount ? Decimal.fromPlanck(receiving.amount, receiving.token.decimals) : null
        return {
          logo: receiving.token.logoURI,
          symbol: receiving.token.symbol,
          amount,
        }
      }
    }
  }, [activity])

  if (activity.status.status === 'NOT_FOUND') {
    return (
      <Link to={`https://scan.li.fi/tx/${data.id}`} target="_blank">
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
    <Link to={`https://scan.li.fi/tx/${data.id}`} target="_blank">
      <SurfaceButton className="min-h-[56px] !w-full !rounded-[8px] !px-[8px] py-[12px] [&>div>span]:!w-full [&>div]:!justify-start">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <div className="flex min-w-max items-center">
              {fromAsset?.logo && (
                <img src={fromAsset.logo} className="h-[32px] w-[32px] rounded-full border-2 border-gray-800" />
              )}
              {destAsset?.logo && (
                <img
                  src={destAsset.logo}
                  className="-ml-[12px] h-[32px] w-[32px] min-w-[32px] rounded-full border-2 border-gray-800"
                />
              )}
            </div>
            <div>
              <div className="flex items-center gap-[4px]">
                <span className="text-[14px] font-semibold text-white">
                  {fromAsset?.amount?.toLocaleString()} {fromAsset?.symbol}
                </span>
                <ArrowRight className="text-gray-600" size={16} />
                <span className="text-[14px] font-semibold text-white">
                  {destAsset?.amount?.toLocaleString()} {destAsset?.symbol}
                </span>
              </div>
              <div className="flex items-center gap-[4px]">
                {activity.status.status === 'DONE' ? (
                  <Check className="text-primary" size={12} />
                ) : activity.status.status === 'FAILED' || activity.status.status === 'INVALID' ? (
                  <X className="text-red-500" size={12} />
                ) : (
                  <CircularProgressIndicator size={12} />
                )}
                <p className="text-[12px] !leading-none text-gray-400">{new Date(timestamp).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <ArrowUpRight className="text-primary" size={20} />
        </div>
      </SurfaceButton>
    </Link>
  )
}
