import { SwappableAssetWithDecimals } from './swap-modules/common.swap-module'
import { selectedCurrencyState } from '@/domains/balances'
import { useTokenRates, useTokens } from '@talismn/balances-react'
import { githubUnknownTokenLogoUrl } from '@talismn/chaindata-provider'
import { Decimal } from '@talismn/math'
import { Clickable, Skeleton, Surface } from '@talismn/ui'
import { useCallback, useMemo } from 'react'
import { useRecoilValue } from 'recoil'

type Props = {
  asset: SwappableAssetWithDecimals
  networkName: string
  evmAddress?: `0x${string}`
  substrateAddress?: string
  onClick: (asset: SwappableAssetWithDecimals) => void
  balance?: Decimal
}

export const SwapTokenRow: React.FC<Props> = ({
  asset,
  balance,
  networkName,
  evmAddress,
  substrateAddress,
  onClick,
}) => {
  const currency = useRecoilValue(selectedCurrencyState)
  const rates = useTokenRates()
  const tokens = useTokens()

  const bestGuessRate = useMemo(() => {
    if (!tokens) return undefined
    return Object.entries(rates ?? {}).find(([id]) => tokens[id]?.symbol === asset.symbol)?.[1]
  }, [asset.symbol, rates, tokens])

  const rate = useMemo(() => rates?.[asset.id] ?? bestGuessRate, [asset.id, bestGuessRate, rates])

  const handleClick = useCallback(() => {
    onClick(asset)
  }, [asset, onClick])

  return (
    <Clickable.WithFeedback className="w-full" onClick={handleClick}>
      <Surface className="!w-full !h-[72px] !rounded-[8px] grid grid-cols-3 px-[16px] gap-[8px]">
        <div className="w-full flex items-center gap-[8px]">
          <img
            src={asset.image ?? githubUnknownTokenLogoUrl}
            className="w-[24px] h-[24px] min-w-[24px] sm:min-w-[40px] sm:w-[40px] sm:h-[40px] rounded-full"
          />
          <div className="flex flex-col gap-[4px] overflow-hidden">
            <p className="text-[14px] leading-none">{asset.symbol}</p>
            <p className="text-[12px] truncate leading-none !text-muted-foreground">{asset.name}</p>
          </div>
        </div>

        <div className="flex items-center">
          <p className="text-[14px]">{networkName}</p>
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
      </Surface>
    </Clickable.WithFeedback>
  )
}
