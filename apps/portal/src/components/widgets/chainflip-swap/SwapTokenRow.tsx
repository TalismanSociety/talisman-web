import { useTokenRates, useTokens } from '@talismn/balances-react'
import { githubUnknownTokenLogoUrl } from '@talismn/chaindata-provider'
import { Skeleton } from '@talismn/ui/atoms/Skeleton'
import { Tooltip } from '@talismn/ui/atoms/Tooltip'
import { toast } from '@talismn/ui/organisms/Toaster'
import { Check, Copy, ExternalLink } from '@talismn/web-icons'
import { useAtomValue } from 'jotai'
import { loadable } from 'jotai/utils'
import { AlertTriangle } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { selectedCurrencyState } from '@/domains/balances'
import { useCopied } from '@/hooks/useCopied'
import { useTokenRatesFromUsd } from '@/hooks/useTokenRatesFromUsd'
import { Decimal } from '@/util/Decimal'
import { truncateAddress } from '@/util/helpers'

import { SwappableAssetWithDecimals } from './swap-modules/common.swap-module'
import { uniswapExtendedTokensList, uniswapSafeTokensList } from './swaps.api'

type Props = {
  asset: SwappableAssetWithDecimals
  networkName: string
  networkLogo?: string
  evmAddress?: `0x${string}`
  substrateAddress?: string
  erc20Address?: string
  onClick: (asset: SwappableAssetWithDecimals, showWarning: boolean) => void
  balance?: Decimal
  explorerUrl?: string
}

export const SwapTokenRow: React.FC<Props> = ({
  asset,
  balance,
  networkLogo,
  networkName,
  erc20Address,
  evmAddress,
  explorerUrl,
  substrateAddress,
  onClick,
}) => {
  const currency = useRecoilValue(selectedCurrencyState)
  const rates = useTokenRates()
  const tokens = useTokens()
  const { copied, copy } = useCopied()
  const uniswapSafeList = useAtomValue(loadable(uniswapSafeTokensList))
  const uniswapExtendedList = useAtomValue(loadable(uniswapExtendedTokensList))

  const isSafe = useMemo(
    () =>
      uniswapSafeList.state === 'hasData'
        ? uniswapSafeList.data.some(t => t.address.toLowerCase() === erc20Address?.toLowerCase())
        : false,
    [erc20Address, uniswapSafeList]
  )
  const isExtended = useMemo(
    () =>
      uniswapExtendedList.state === 'hasData'
        ? uniswapExtendedList.data.some(t => t.address.toLowerCase() === erc20Address?.toLowerCase())
        : false,
    [erc20Address, uniswapExtendedList]
  )

  const usdOverride = useMemo(() => {
    if (asset.context.lifi) {
      return asset.context.lifi?.priceUSD
    }
    return null
  }, [asset.context])

  const ratesOverride = useTokenRatesFromUsd(usdOverride)

  const bestGuessRate = useMemo(() => {
    if (!tokens) return undefined
    return Object.entries(rates ?? {}).find(([id]) => tokens[id]?.symbol === asset.symbol)?.[1] ?? ratesOverride
  }, [asset.symbol, rates, ratesOverride, tokens])

  const rate = useMemo(() => rates?.[asset.id] ?? bestGuessRate, [asset.id, bestGuessRate, rates])

  const shouldShowWarning = useMemo(
    () => !isExtended && !isSafe && erc20Address !== undefined,
    [erc20Address, isExtended, isSafe]
  )

  const handleClick = useCallback(() => {
    onClick(asset, shouldShowWarning)
  }, [asset, onClick, shouldShowWarning])

  return (
    <div
      className="grid !h-[64px] !w-full cursor-pointer grid-cols-3 gap-[8px] !rounded-[12px] px-[16px] hover:bg-gray-800"
      onClick={handleClick}
    >
      <Tooltip content={<p className="!text-muted-foreground truncate text-[12px] leading-none">{asset.name}</p>}>
        <div className="flex w-full items-center gap-[8px]">
          <div className="relative">
            {networkLogo ? (
              <img
                src={networkLogo}
                key={networkLogo}
                className="absolute -right-[4px] -top-[4px] h-[12px] w-[12px] min-w-[12px] rounded-full border-[2px] border-gray-800 bg-gray-800 sm:h-[20px] sm:w-[20px] sm:min-w-[20px]"
              />
            ) : null}
            <img
              key={asset.image ?? githubUnknownTokenLogoUrl}
              src={asset.image ?? githubUnknownTokenLogoUrl}
              className="h-[24px] w-[24px] min-w-[24px] rounded-full sm:h-[40px] sm:w-[40px] sm:min-w-[40px]"
            />
          </div>
          <div className="flex flex-col gap-[4px] overflow-hidden">
            <div className="flex items-center gap-[4px]">
              <p className="text-[14px] leading-none">{asset.symbol}</p>
              {shouldShowWarning && <AlertTriangle className="text-gray-400" size={14} />}
            </div>
            <p className="text-muted-foreground text-[12px] font-medium">
              {rate?.[currency]?.toLocaleString(undefined, { currency, style: 'currency' }) ?? '-'}
            </p>
          </div>
        </div>
      </Tooltip>

      <div className="flex flex-col justify-center">
        <p className="text-[14px]">{networkName}</p>
        {erc20Address ? (
          explorerUrl ? (
            <Link to={`${explorerUrl}/token/${erc20Address}`} target="_blank" onClick={e => e.stopPropagation()}>
              <div className="group flex cursor-pointer items-center gap-[4px]">
                <p className="text-muted-foreground group-hover:text-primary mt-[2px] text-[12px]">
                  {truncateAddress(erc20Address)}
                </p>
                <ExternalLink className="group-hover:text-primary" size={14} />
              </div>
            </Link>
          ) : (
            <div
              className="group flex cursor-pointer items-center gap-[4px]"
              onClick={e => {
                e.stopPropagation()
                copy(erc20Address)
                toast('Copied token address!')
              }}
            >
              <p className="text-muted-foreground group-hover:text-primary mt-[2px] text-[12px]">
                {truncateAddress(erc20Address)}
              </p>
              {copied ? (
                <Check size={14} className="text-green-400" />
              ) : (
                <Copy size={14} className="group-hover:text-primary" />
              )}
            </div>
          )
        ) : null}
      </div>

      {(asset.networkType === 'evm' && evmAddress) || (asset.networkType === 'substrate' && substrateAddress) ? (
        balance ? (
          <div className="flex flex-col items-end justify-center">
            <p className="text-[14px] font-medium">{balance?.toLocaleString(undefined, {})}</p>
            {rate ? (
              <p className="text-muted-foreground text-[12px]">
                {((rate[currency] ?? 0) * balance.toNumber()).toLocaleString(undefined, {
                  currency,
                  style: 'currency',
                })}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col items-end justify-center">
            <Skeleton.Surface className="h-[20px] w-[72px]" />
            <Skeleton.Surface className="mt-[4px] h-[16px] w-[36px]" />
          </div>
        )
      ) : (
        <div className="flex items-center justify-end">
          <p className="text-muted-foreground text-right text-[12px]">-</p>
        </div>
      )}
    </div>
  )
}
