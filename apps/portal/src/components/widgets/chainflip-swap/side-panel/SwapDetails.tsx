import { CircularProgressIndicator, Clickable, Skeleton, Surface } from '@talismn/ui'
import { useAtom, useAtomValue } from 'jotai'
import { loadable } from 'jotai/utils'
import { Loadable } from 'jotai/vanilla/utils/loadable'
import { ArrowUpDown, Check } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import ErrorBoundary from '@/components/widgets/ErrorBoundary'
import { cn } from '@/lib/utils'

import {
  BaseQuote,
  fromAmountAtom,
  fromAssetAtom,
  quoteSortingAtom,
  selectedProtocolAtom,
  selectedSubProtocolAtom,
  swappingAtom,
  toAssetAtom,
} from '../swap-modules/common.swap-module'
import { sortedQuotesAtom } from '../swaps.api'
import { SwapDetailsCard } from './details/SwapDetailsCard'
import { SwapDetailsError } from './details/SwapDetailsError'
import { SwapDetailsPlaceholder } from './details/SwapDetailsPlaceholder'

const LoadingUI: React.FC<{ title?: string; description?: React.ReactNode }> = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center gap-[8px] rounded-[8px] border border-gray-800 p-[16px]">
    <div className="flex h-[94px] w-[94px] items-center justify-center">
      <CircularProgressIndicator size={48} />
    </div>
    <div>
      <h4 className="text-center text-[14px] font-bold">{title}</h4>
      <p className="text-center text-[14px] text-gray-400">{description}</p>
    </div>
  </div>
)

const SORTS = {
  bestRate: {
    name: 'Best Rate',
  },
  fastest: {
    name: 'Fastest',
  },
  cheapest: {
    name: 'Cheapest',
  },
  decentalised: {
    name: 'Most Decentralized',
  },
} as const

const Details: React.FC = () => {
  const quotes = useAtomValue(loadable(sortedQuotesAtom))
  const swapping = useAtomValue(swappingAtom)
  const [sort, setSort] = useAtom(quoteSortingAtom)
  const [selectedProtocol, setSelectedProtocol] = useAtom(selectedProtocolAtom)
  const [selectedSubProtocol, setSelectedSubProtocol] = useAtom(selectedSubProtocolAtom)
  const [cachedQuotes, setCachedQuotes] = useState<{ fees?: number; quote: Loadable<BaseQuote | null> }[]>([])
  const fromAmount = useAtomValue(fromAmountAtom)
  const fromAsset = useAtomValue(fromAssetAtom)
  const toAsset = useAtomValue(toAssetAtom)

  // Reset cached quotes when any of the swap parameters change
  useEffect(() => {
    setCachedQuotes([])
  }, [fromAmount, fromAsset, toAsset])

  // Update cached quotes when quotes change
  useEffect(() => {
    if (quotes.state === 'hasData' && quotes.data) {
      const allQuotesLoaded = quotes.data.every(q => q.quote.state !== 'loading')
      setCachedQuotes(prev => (prev.length === 0 || allQuotesLoaded ? quotes.data! : prev))
    }
  }, [quotes])

  useEffect(() => {
    // Reset protocol selection if no valid protocol found in cached quotes
    const isSelectedProtocolAvailable = !cachedQuotes.find(
      q => q.quote.state === 'hasData' && q.quote.data?.protocol === selectedProtocol
    )
    if (isSelectedProtocolAvailable) {
      setSelectedProtocol(null)
      setSelectedSubProtocol(undefined)
    }

    // Select default subprotocol if nothing is selected and the first quote has a subprotocol
    if ((!selectedSubProtocol || !selectedProtocol) && cachedQuotes.length > 0) {
      const defaultQuote = cachedQuotes[0]
      if (defaultQuote?.quote.state === 'hasData' && defaultQuote.quote.data?.subProtocol)
        setSelectedSubProtocol(defaultQuote.quote.data?.subProtocol)
    }
  }, [selectedProtocol, setSelectedProtocol, quotes, cachedQuotes, setSelectedSubProtocol, selectedSubProtocol])

  if (swapping)
    return (
      <LoadingUI
        title="Processing Swap"
        description={
          swapping ? (
            <span>
              We are processing this swap.
              <br />
              It shouldn't take too long...
            </span>
          ) : (
            "This shouldn't take too long."
          )
        }
      />
    )
  if (quotes.state === 'hasError' || cachedQuotes.every(q => q.quote?.state === 'hasError'))
    return (
      <SwapDetailsError
        message={
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (quotes.state === 'hasError' ? (quotes.error as any) : {})?.message ?? 'No route found. Try larger amount.'
        }
      />
    )
  if (quotes.state === 'hasData' && quotes.data?.length === 0)
    return <SwapDetailsError message="Pair is unavailable." />

  return (
    <div className="flex w-full flex-col gap-[8px]">
      <div className="flex w-full items-center justify-between">
        {cachedQuotes.length > 0 && cachedQuotes.every(c => c.quote.state !== 'loading') ? (
          <p className="text-muted-foreground text-[14px]">
            {cachedQuotes.length} Option{cachedQuotes.length > 1 ? 's' : ''}
          </p>
        ) : (
          <Skeleton.Surface className="h-[22.4px] w-[66px]" />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Clickable.WithFeedback>
              <Surface className="flex items-center gap-[8px] rounded-[8px] px-[12px] py-[8px]">
                <ArrowUpDown className="h-[12px] w-[12px]" />
                <p className="text-muted-foreground text-[14px] leading-none">{SORTS[sort].name}</p>
              </Surface>
            </Clickable.WithFeedback>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.entries(SORTS).map(([key, value]) =>
              key === 'decentalised' ? null : (
                <DropdownMenuItem
                  key={key}
                  className="flex items-center justify-between gap-[8px]"
                  onClick={() => setSort(key as keyof typeof SORTS)}
                >
                  <p className={cn('text-[14px]')}>{value.name}</p>
                  {key === sort ? <Check className="h-[16px] w-[16px]" /> : null}
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className=" flex flex-col gap-[8px]">
        {cachedQuotes.length > 0 ? (
          cachedQuotes.map((q, index) =>
            q.quote.state === 'hasData' && q.quote.data ? (
              <SwapDetailsCard
                selected={
                  selectedProtocol === null
                    ? index === 0
                    : q.quote.state === 'hasData' &&
                      selectedProtocol === q.quote.data?.protocol &&
                      (q.quote.data.subProtocol ? q.quote.data.subProtocol === selectedSubProtocol : true)
                }
                quote={q.quote.data}
                key={`${q.quote.data.protocol}${q.quote.data.subProtocol}`}
              />
            ) : q.quote.state === 'loading' ? (
              <Skeleton.Surface key={index} className="h-[79.39px] w-full rounded-[8px]" />
            ) : null
          )
        ) : (
          <>
            <Skeleton.Surface className="h-[79.39px] w-full rounded-[8px]" />
            <Skeleton.Surface className="h-[79.39px] w-full rounded-[8px]" />
            <Skeleton.Surface className="h-[79.39px] w-full rounded-[8px]" />
          </>
        )}
      </div>
    </div>
  )
}

export const SwapDetails: React.FC = () => {
  const fromAsset = useAtomValue(fromAssetAtom)
  const toAsset = useAtomValue(toAssetAtom)
  const fromAmount = useAtomValue(fromAmountAtom)

  if (!fromAsset || !toAsset || !fromAmount.planck) return <SwapDetailsPlaceholder />

  return (
    // Details component handles its own error already. This is just in case there is unhandled error
    <ErrorBoundary>
      <Suspense fallback={<LoadingUI />}>
        <Details />
      </Suspense>
    </ErrorBoundary>
  )
}
