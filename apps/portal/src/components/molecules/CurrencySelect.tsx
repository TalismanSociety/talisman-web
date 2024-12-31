import { Clickable } from '@talismn/ui/atoms/Clickable'
import { useRecoilState } from 'recoil'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/molecules/DropdownMenu'
import { currencyConfig, selectedCurrencyState } from '@/domains/balances/currency'
import { cn } from '@/util/cn'

export const CurrencySelect = ({ className }: { className?: string }) => {
  const [currentCurrency, setCurrency] = useRecoilState(selectedCurrencyState)
  const symbol = currencyConfig[currentCurrency]?.symbol ?? '?'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Clickable.WithFeedback className={className}>
          <div className="flex h-12 w-12 select-none items-center justify-center rounded-full border border-gray-600 bg-gray-950 text-white">
            <div className="font-mono text-xl">{symbol}</div>
          </div>
        </Clickable.WithFeedback>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn('z-50 flex flex-col gap-1 overflow-hidden rounded-3xl bg-gray-950 py-4')}
        align="end"
      >
        {Object.entries(currencyConfig).map(([currency, config]) => (
          <DropdownMenuItem
            key={currency}
            className={cn(
              'flex cursor-pointer items-center justify-between gap-2 px-10 py-2',
              'focus:bg-white/15',
              currency === currentCurrency && 'bg-white/10'
            )}
            onClick={() => setCurrency(currency as keyof typeof currencyConfig)}
          >
            <div className="font-mono text-xl">{config.symbol}</div>
            <div className="text-2xl">{config.name}</div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
