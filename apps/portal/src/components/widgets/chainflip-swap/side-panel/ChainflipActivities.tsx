import { assetIcons } from '../chainflip-config'
import { chainflipAssetsState, chainflipNetworkState } from '../chainflip.api'
import { swapsState, swapStatusSelector } from '../swap.api'
import { ErrorBoundary } from '@sentry/react'
import { Decimal } from '@talismn/math'
import { CircularProgressIndicator, Skeleton, SurfaceButton } from '@talismn/ui'
import { ArrowRight, ArrowUpRight, Check, X } from '@talismn/web-icons'
import { Suspense, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'

const Activity: React.FC<{ id: string; date: string | number }> = ({ id, date }) => {
  const status = useRecoilValue(swapStatusSelector(id))
  const assets = useRecoilValue(chainflipAssetsState)
  const dateObj = new Date(status.depositChannelCreatedAt ?? date)
  const network = useRecoilValue(chainflipNetworkState)

  const fromAsset = useMemo(() => assets.find(asset => asset.asset === status.srcAsset), [assets, status])

  const fromAmount = useMemo(() => {
    const amount = status.depositAmount ?? status.expectedDepositAmount
    if (!amount || !fromAsset) return null
    return Decimal.fromPlanck(amount, fromAsset.decimals, { currency: fromAsset.symbol })
  }, [status, fromAsset])

  const destAsset = useMemo(() => assets.find(asset => asset.asset === status.destAsset), [assets, status])
  const destAmount = useMemo(() => {
    if ('egressAmount' in status && destAsset) {
      return Decimal.fromPlanck(status.egressAmount, destAsset.decimals, { currency: destAsset.symbol })
    }
    return null
  }, [status, destAsset])

  const chainflipUrl = useMemo(() => {
    switch (network) {
      case 'mainnet':
        return `https://scan.chainflip.io/channels/${id}`
      case 'perseverance':
        return `https://scan.perseverance.chainflip.io/channels/${id}`
      default:
        return ''
    }
  }, [network, id])

  return (
    <Link to={chainflipUrl} target="_blank">
      <SurfaceButton className="!rounded-[8px] !w-full [&>div]:!justify-start [&>div>span]:!w-full !px-[8px] py-[12px]">
        <div className="flex items-center w-full justify-between gap-[8px]">
          <div className="flex items-center gap-[8px]">
            <div className="flex items-center ">
              <img
                src={assetIcons[status.srcAsset]}
                className="w-[32px] h-[32px] border-2 border-gray-800 rounded-full"
              />
              {status.destAsset && (
                <img
                  src={assetIcons[status.destAsset]}
                  className="w-[32px] h-[32px] min-w-[32px] -ml-[12px] border-2 border-gray-800 rounded-full"
                />
              )}
            </div>
            <div>
              <div className="flex items-center gap-[4px]">
                <p className="text-[14px] font-semibold text-white !leading-none">
                  {fromAmount?.toLocaleString(undefined, { minimumFractionDigits: 4 })}
                </p>
                <ArrowRight className="text-gray-600" size={16} />
                {destAmount ? (
                  <p className="text-[14px] font-semibold text-white !leading-none">
                    {destAmount.toLocaleString(undefined, { minimumFractionDigits: 4 })}
                  </p>
                ) : status.expired ? (
                  <div className="p-[4px] px-[6px] bg-orange-500/30 rounded-full">
                    <p className="text-[12px] leading-none text-orange-300">Expired</p>
                  </div>
                ) : (
                  <CircularProgressIndicator size={12} />
                )}
              </div>
              <div className="flex items-center justify-start gap-[4px] mt-[2px]">
                {status.state === 'COMPLETE' ? (
                  <Check className="text-primary" size={12} />
                ) : status.state === 'FAILED' || status.expired ? (
                  <X className="text-red-500" size={12} />
                ) : (
                  <CircularProgressIndicator size={12} />
                )}
                <p className="text-gray-400 text-[12px] !leading-none">{dateObj.toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <ArrowUpRight className="text-primary" size={20} />
        </div>
      </SurfaceButton>
    </Link>
  )
}
export const ChainflipActivities: React.FC = () => {
  const [activities] = useRecoilState(swapsState)
  if (activities.length > 0) {
    return (
      <div className="w-full grid gap-[8px]">
        {activities.map(activity => (
          <ErrorBoundary
            key={activity.id}
            fallback={<p className="text-[12px] text-gray-400">Error loading swap ID: {activity.id}</p>}
          >
            <Suspense fallback={<Skeleton.Surface className="h-[56px] w-full" />}>
              <Activity {...activity} />
            </Suspense>
          </ErrorBoundary>
        ))}
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center gap-[8px] flex-col border-gray-800 border rounded-[8px] p-[16px]">
      <svg xmlns="http://www.w3.org/2000/svg" width="97" height="96" viewBox="0 0 97 96" fill="none">
        <circle cx="48.5" cy="48" r="48" fill="url(#paint0_linear_3285_21153)" />
        <path
          d="M72.5 48H62.9L55.7 72L41.3 24L34.1 48H24.5"
          stroke="url(#paint1_linear_3285_21153)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear_3285_21153"
            x1="48.5"
            y1="0"
            x2="48.5"
            y2="96"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1B1B1B" />
            <stop offset="1" stopColor="#1B1B1B" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_3285_21153"
            x1="32.9143"
            y1="15.8321"
            x2="66.422"
            y2="85.4374"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#A5A5A5" />
            <stop offset="1" stopColor="#A5A5A5" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div>
        <h4 className="font-bold text-[14px] text-center">No Recent Activity</h4>
        <p className="text-gray-400 text-[14px] text-center">
          We were not able to find any transactions for the selected account.
        </p>
      </div>
    </div>
  )
}
