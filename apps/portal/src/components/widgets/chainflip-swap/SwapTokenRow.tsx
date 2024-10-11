import { SwappableAssetWithDecimals } from './swap-modules/common.swap-module'
import { uniswapExtendedTokensList, uniswapSafeTokensList } from './swaps.api'
import { selectedCurrencyState } from '@/domains/balances'
import { useCopied } from '@/hooks/useCopied'
import { truncateAddress } from '@/util/helpers'
import { useTokenRates, useTokens } from '@talismn/balances-react'
import { githubUnknownTokenLogoUrl } from '@talismn/chaindata-provider'
import { Decimal } from '@talismn/math'
import { Skeleton, toast } from '@talismn/ui'
import { Check, Copy, ExternalLink } from '@talismn/web-icons'
import { useAtomValue } from 'jotai'
import { loadable } from 'jotai/utils'
import { AlertTriangle } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

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

  const bestGuessRate = useMemo(() => {
    if (!tokens) return undefined
    return Object.entries(rates ?? {}).find(([id]) => tokens[id]?.symbol === asset.symbol)?.[1]
  }, [asset.symbol, rates, tokens])

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
      className="!w-full !h-[64px] !rounded-[12px] grid grid-cols-3 px-[16px] gap-[8px] hover:bg-gray-800 cursor-pointer"
      onClick={handleClick}
    >
      <div className="w-full flex items-center gap-[8px]">
        <div className="relative">
          {networkLogo ? (
            <img
              src={networkLogo}
              key={networkLogo}
              className="border-[2px] bg-gray-800 border-gray-800 w-[12px] absolute -top-[4px] -right-[4px] h-[12px] min-w-[12px] sm:min-w-[20px] sm:w-[20px] sm:h-[20px] rounded-full"
            />
          ) : null}
          <img
            key={asset.image ?? githubUnknownTokenLogoUrl}
            src={asset.image ?? githubUnknownTokenLogoUrl}
            className="w-[24px] h-[24px] min-w-[24px] sm:min-w-[40px] sm:w-[40px] sm:h-[40px] rounded-full"
          />
        </div>
        <div className="flex flex-col gap-[4px] overflow-hidden">
          <div className="flex items-center gap-[4px]">
            <p className="text-[14px] leading-none">{asset.symbol}</p>
            {shouldShowWarning && <AlertTriangle className="text-gray-400" size={14} />}
          </div>
          <p className="text-[12px] truncate leading-none !text-muted-foreground">{asset.name}</p>
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <p className="text-[14px]">{networkName}</p>
        {erc20Address ? (
          explorerUrl ? (
            <Link to={`${explorerUrl}/token/${erc20Address}`} target="_blank" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-[4px] group cursor-pointer">
                <p className="text-[12px] text-muted-foreground mt-[2px] group-hover:text-primary">
                  {truncateAddress(erc20Address)}
                </p>
                <ExternalLink className="group-hover:text-primary" size={14} />
              </div>
            </Link>
          ) : (
            <div
              className="flex items-center gap-[4px] group cursor-pointer"
              onClick={e => {
                e.stopPropagation()
                copy(erc20Address)
                toast('Copied token address!')
              }}
            >
              <p className="text-[12px] text-muted-foreground mt-[2px] group-hover:text-primary">
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
          <div className="flex items-end flex-col justify-center">
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
          <div className="flex items-end flex-col justify-center">
            <Skeleton.Surface className="h-[20px] w-[72px]" />
            <Skeleton.Surface className="h-[16px] w-[36px] mt-[4px]" />
          </div>
        )
      ) : (
        <div className="flex flex-col items-end justify-center">
          <p className="font-medium text-[12px] text-right text-muted-foreground">
            {rate?.[currency]?.toLocaleString(undefined, { currency, style: 'currency' }) ?? '-'}
          </p>
        </div>
      )}
    </div>
  )
}
