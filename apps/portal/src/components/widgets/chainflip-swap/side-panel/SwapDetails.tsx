import ErrorBoundary from '../../ErrorBoundary'
import {
  BaseQuote,
  fromAmountAtom,
  fromAssetAtom,
  quoteSortingAtom,
  selectedProtocolAtom,
  swappingAtom,
  toAssetAtom,
} from '../swap-modules/common.swap-module'
import { sortedQuotesAtom } from '../swaps.api'
import { SwapDetailsCard } from './details/SwapDetailsCard'
import { SwapDetailsError } from './details/SwapDetailsError'
import { SwapDetailsPlaceholder } from './details/SwapDetailsPlaceholder'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { CircularProgressIndicator, Clickable, Skeleton, Surface } from '@talismn/ui'
import { useAtom, useAtomValue } from 'jotai'
import { loadable } from 'jotai/utils'
import { ArrowUpDown, Check } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'

const LoadingUI: React.FC<{ title?: string; description?: React.ReactNode }> = ({ title, description }) => (
  <div className="flex items-center justify-center gap-[8px] flex-col border-gray-800 border rounded-[8px] p-[16px]">
    <div className="flex items-center justify-center h-[94px] w-[94px]">
      <CircularProgressIndicator size={48} />
    </div>
    <div>
      <h4 className="font-bold text-[14px] text-center">{title}</h4>
      <p className="text-gray-400 text-[14px] text-center">{description}</p>
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
  const [cachedQuotes, setCachedQuotes] = useState<{ quote: BaseQuote & { decentralisationScore: number } }[]>([])
  const fromAmount = useAtomValue(fromAmountAtom)
  const fromAsset = useAtomValue(fromAssetAtom)
  const toAsset = useAtomValue(toAssetAtom)

  useEffect(() => {
    setCachedQuotes([])
  }, [fromAmount, fromAsset, toAsset])

  useEffect(() => {
    if (quotes.state === 'hasData' && quotes.data) {
      setCachedQuotes(quotes.data)
    }
  }, [quotes])

  useEffect(() => {
    if (!cachedQuotes.find(q => q.quote.protocol === selectedProtocol)) setSelectedProtocol(null)
  }, [selectedProtocol, setSelectedProtocol, quotes, cachedQuotes])

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
  if (quotes.state === 'hasError') return <SwapDetailsError message={(quotes.error as any)?.message ?? ''} />
  if (quotes.state === 'hasData' && quotes.data?.length === 0)
    return <SwapDetailsError message="Pair is unavailable." />

  return (
    <div className="w-full flex flex-col gap-[8px]">
      <div className="flex items-center justify-between w-full">
        {cachedQuotes.length > 0 ? (
          <p className="text-muted-foreground text-[14px]">{cachedQuotes.length} Options</p>
        ) : (
          <Skeleton.Surface className="h-[22.4px] w-[66px]" />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Clickable.WithFeedback>
              <Surface className="flex items-center gap-[8px] px-[12px] py-[8px] rounded-[8px]">
                <ArrowUpDown className="w-[12px] h-[12px]" />
                <p className="text-[14px] leading-none text-muted-foreground">{SORTS[sort].name}</p>
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
                  {key === sort ? <Check className="w-[16px] h-[16px]" /> : null}
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className=" flex flex-col gap-[8px]">
        {cachedQuotes.length > 0 ? (
          cachedQuotes.map((q, index) => (
            <SwapDetailsCard
              selected={selectedProtocol === null ? index === 0 : selectedProtocol === q.quote.protocol}
              quote={q.quote}
              key={q.quote.protocol}
            />
          ))
        ) : (
          <>
            <Skeleton.Surface className="w-full h-[79.39px] rounded-[8px]" />
            <Skeleton.Surface className="w-full h-[79.39px] rounded-[8px]" />
            <Skeleton.Surface className="w-full h-[79.39px] rounded-[8px]" />
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
