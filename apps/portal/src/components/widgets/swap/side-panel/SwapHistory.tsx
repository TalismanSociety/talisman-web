import type React from 'react'
import { ErrorBoundary } from '@sentry/react'
import { Skeleton } from '@talismn/ui/atoms/Skeleton'
import { useAtomValue } from 'jotai'
import { Suspense, useCallback } from 'react'

import type { SwapActivity } from '../swap-modules/common.swap-module'
import { swapsAtom } from '../swap-modules/common.swap-module'
import { ChainflipActivity } from './activities/ChainflipActivity'
import { LifiActivity } from './activities/LifiActivity'
import { SimpleswapActivity } from './activities/SimpleswapActivity'
import { StealthexActivity } from './activities/StealthexActivity'

export const SwapHistory: React.FC = () => {
  const swaps = useAtomValue(swapsAtom)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderSwap = useCallback((swap: SwapActivity<any>) => {
    switch (swap.protocol) {
      case 'chainflip':
        return <ChainflipActivity key={swap.timestamp} timestamp={swap.timestamp} data={swap.data} />
      case 'simpleswap':
        return <SimpleswapActivity key={swap.timestamp} timestamp={swap.timestamp} data={swap.data} />
      case 'stealthex':
        return <StealthexActivity key={swap.timestamp} timestamp={swap.timestamp} data={swap.data} />
      case 'lifi':
        return <LifiActivity key={swap.timestamp} timestamp={swap.timestamp} data={swap.data} />
      default:
        return null
    }
  }, [])

  if (swaps.length === 0)
    return (
      <div className="flex flex-col items-center justify-center gap-[8px] rounded-[8px] border border-gray-800 p-[16px]">
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
          <h4 className="text-center text-[14px] font-bold">No Recent Activity</h4>
          <p className="text-center text-[14px] text-gray-400">
            We were not able to find any transactions for the selected account.
          </p>
        </div>
      </div>
    )

  return (
    <div className="grid w-full gap-[8px]">
      {swaps.map(swap => (
        <ErrorBoundary key={swap.timestamp} fallback={<Skeleton.Surface className="h-[56px] w-full" />}>
          <Suspense fallback={<Skeleton.Surface className="h-[56px] w-full" />}>{renderSwap(swap)}</Suspense>
        </ErrorBoundary>
      ))}
    </div>
  )
}
