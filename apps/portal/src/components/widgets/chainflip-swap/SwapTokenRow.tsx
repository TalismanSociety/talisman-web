import { SwappableAssetWithDecimals } from './swap-modules/common.swap-module'
import { selectedCurrencyState } from '@/domains/balances'
import { useFastBalance, UseFastBalanceProps } from '@/hooks/useFastBalance'
import { useTokenRates } from '@talismn/balances-react'
import { githubUnknownTokenLogoUrl } from '@talismn/chaindata-provider'
import { Clickable, Surface } from '@talismn/ui'
import { useCallback, useMemo } from 'react'
import { useRecoilValue } from 'recoil'

type Props = {
  asset: SwappableAssetWithDecimals
  networkName: string
  evmAddress?: `0x${string}`
  substrateAddress?: string
  onClick: (asset: SwappableAssetWithDecimals) => void
}

export const SwapTokenRow: React.FC<Props> = ({ asset, networkName, onClick, evmAddress, substrateAddress }) => {
  const currency = useRecoilValue(selectedCurrencyState)
  const rates = useTokenRates()
  const rate = useMemo(() => rates?.[asset.id], [asset.id, rates])

  const balanceProps: UseFastBalanceProps | undefined = useMemo(
    () =>
      asset.networkType === 'evm'
        ? evmAddress
          ? {
              type: 'evm',
              address: evmAddress,
              networkId: +asset.chainId,
              tokenAddress: asset.contractAddress as `0x${string}`,
            }
          : undefined
        : substrateAddress
        ? {
            type: 'substrate',
            chainId: asset.chainId.toString(),
            address: substrateAddress,
            assetHubAssetId: asset.assetHubAssetId,
          }
        : undefined,
    [asset.assetHubAssetId, asset.chainId, asset.contractAddress, asset.networkType, evmAddress, substrateAddress]
  )
  const balance = useFastBalance(balanceProps)

  const value = useMemo(() => {
    return (rate?.[currency] ?? 0 * (balance?.balance?.transferrable.toNumber() ?? 0)).toLocaleString(undefined, {
      currency,
      style: 'currency',
    })
  }, [balance?.balance?.transferrable, currency, rate])

  const handleClick = useCallback(() => {
    onClick(asset)
  }, [asset, onClick])

  return (
    <Clickable.WithFeedback className="w-full" onClick={handleClick}>
      <Surface className="!w-full !h-[72px] !rounded-[8px] grid grid-cols-3 px-[16px]">
        <div className="w-full flex items-center gap-[8px]">
          <img
            src={asset.image ?? githubUnknownTokenLogoUrl}
            className="w-[24px] h-[24px] min-w-[24px] sm:min-w-[40px] sm:w-[40px] sm:h-[40px] rounded-full"
          />
          <div className="flex flex-col gap-[4px]">
            <p className="text-[14px] leading-none">{asset.symbol}</p>
            <p className="text-[12px] truncate leading-none !text-muted-foreground">{asset.name}</p>
          </div>
        </div>

        <div className="flex items-center">
          <p className="text-[14px]">{networkName}</p>
        </div>

        <div className="flex items-end flex-col justify-center">
          <p className="text-[14px] font-medium">{balance?.balance?.transferrable.toLocaleString(undefined, {})}</p>
          {balanceProps && asset && balance?.balance ? (
            <p className="text-muted-foreground text-[12px]">{value}</p>
          ) : (
            <p className="text-[14px] font-medium">
              {rate?.[currency]?.toLocaleString(undefined, { currency, style: 'currency' }) ?? '-'}
            </p>
          )}
        </div>
      </Surface>
    </Clickable.WithFeedback>
  )
}
