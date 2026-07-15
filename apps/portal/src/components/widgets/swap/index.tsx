import type React from 'react'
import { Button } from '@talismn/ui/atoms/Button'
import { TonalIconButton } from '@talismn/ui/atoms/IconButton'
import { Surface } from '@talismn/ui/atoms/Surface'
import { Repeat } from '@talismn/web-icons'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { loadable } from 'jotai/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useSetJotaiSubstrateApiState } from '@/domains/common/recoils/api'
import { useFastBalance, UseFastBalanceProps } from '@/hooks/useFastBalance'

import { FromAccount } from './FromAccount'
import { shouldFocusDetailsAtom, SidePanel, swapInfoTabAtom } from './side-panel'
import { fromAssetsBalancesAtom, useSetOwnedAddresses } from './swap-balances.api'
import {
  fromAmountAtom,
  fromAssetAtom,
  SwappableAssetWithDecimals,
  swapQuoteRefresherAtom,
  toAssetAtom,
} from './swap-modules/common.swap-module'
import {
  fromAssetsAtom,
  selectedQuoteAtom,
  swapFromSearchAtom,
  swapQuotesAtom,
  swapToSearchAtom,
  toAmountAtom,
  toAssetsAtom,
  useFromAccount,
  useReverse,
  useSetToAddress,
  useSwap,
  useSyncPreviousChainflipSwaps,
} from './swaps.api'
import { TokenAmountInput } from './TokenAmountInput'

export const Swap: React.FC = () => {
  useSetJotaiSubstrateApiState()
  useSyncPreviousChainflipSwaps()

  const setInfoTab = useSetAtom(swapInfoTabAtom)
  const [shouldFocusDetails, setShouldFocusDetails] = useAtom(shouldFocusDetailsAtom)
  const setQuoteRefresher = useSetAtom(swapQuoteRefresherAtom)
  const quote = useAtomValue(loadable(selectedQuoteAtom))

  const [fromAsset, setFromAsset] = useAtom(fromAssetAtom)
  const [fromAmount, setFromAmount] = useAtom(fromAmountAtom)
  const { ethAccounts, substrateAccounts, fromEvmAccount, fromEvmAddress, fromSubstrateAccount, fromSubstrateAddress } =
    useFromAccount()
  useSetToAddress()
  const [toAsset, setToAsset] = useAtom(toAssetAtom)

  const toAmount = useAtomValue(loadable(toAmountAtom))
  const fromAssets = useAtomValue(loadable(fromAssetsAtom))
  const toAssets = useAtomValue(loadable(toAssetsAtom))
  const [cachedToAmount, setCachedToAmount] = useState(toAmount.state === 'hasData' ? toAmount.data : undefined)
  useSetOwnedAddresses(
    useMemo(
      () => [...substrateAccounts, ...ethAccounts].map(account => account.address),
      [substrateAccounts, ethAccounts]
    )
  )
  const balances = useAtomValue(loadable(fromAssetsBalancesAtom))
  const quotes = useAtomValue(swapQuotesAtom)

  const toAmountUsdOverride = useMemo(() => {
    if (quote.state !== 'hasData' || !quote.data) return undefined
    if (quote.data.quote.state !== 'hasData' || !quote.data.quote.data) return undefined

    switch (quote.data.quote.data.protocol) {
      case 'lifi':
        return +(quote.data.quote.data.data?.toAmountUSD ?? 0)
      default:
        return undefined
    }
  }, [quote])

  // reset when any of the inputs change
  useEffect(() => {
    setCachedToAmount(undefined)
  }, [fromAmount, fromAsset, toAsset])

  useEffect(() => {
    if (toAmount.state === 'hasData' && toAmount.data) setCachedToAmount(toAmount.data)
  }, [toAmount])

  const { swapping } = useSwap()
  const reverse = useReverse()

  const setToAddress = useSetToAddress()

  const handleChangeFromAsset = useCallback(
    (asset: SwappableAssetWithDecimals | null) => {
      if (asset && toAsset && asset.id === toAsset.id) return reverse()

      setFromAsset(asset)
      setToAddress()
    },
    [reverse, setFromAsset, setToAddress, toAsset]
  )

  const handleChangeToAsset = useCallback(
    (asset: SwappableAssetWithDecimals | null) => {
      if (asset && fromAsset && asset.id === fromAsset.id) return reverse()

      setToAsset(asset)
      setToAddress({ toAsset: asset })
    },
    [fromAsset, reverse, setToAddress, setToAsset]
  )

  const balanceProps: UseFastBalanceProps | undefined = useMemo(
    () =>
      fromAsset
        ? fromAsset.networkType === 'evm'
          ? fromEvmAddress
            ? {
                type: 'evm',
                address: fromEvmAddress,
                networkId: +fromAsset.chainId,
                tokenAddress: fromAsset.contractAddress as `0x${string}`,
              }
            : undefined
          : fromSubstrateAddress
          ? {
              type: 'substrate',
              chainId: fromAsset.chainId.toString(),
              address: fromSubstrateAddress,
              assetHubAssetId: fromAsset.assetHubAssetId,
            }
          : undefined
        : undefined,
    [fromAsset, fromEvmAddress, fromSubstrateAddress]
  )
  const fastBalance = useFastBalance(balanceProps)

  useEffect(() => {
    if (fromAmount.planck > 0n && fromAsset && toAsset) setShouldFocusDetails(true)
  }, [fromAsset, toAsset, setShouldFocusDetails, fromAmount.planck])

  // refresh quote every 15 seconds
  useEffect(() => {
    if (swapping || quotes.state === 'loading') return
    if (quotes.state === 'hasData') {
      if (quotes.data?.some(d => d.state === 'loading')) return
    }
    const id = setInterval(() => {
      setShouldFocusDetails(false)
      setQuoteRefresher(new Date().getTime())
    }, 20_000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapping])

  // bring user back to details page to wait for quote
  useEffect(() => {
    if (shouldFocusDetails && !swapping) {
      setShouldFocusDetails(false)
      setInfoTab('details')
    }
  }, [toAmount, setInfoTab, shouldFocusDetails, setShouldFocusDetails, swapping])

  return (
    <div className="mb-[40px] flex w-full flex-col md:flex-row">
      <div className="relative grid w-full cursor-not-allowed gap-[8px]">
        <div className="absolute inset-0 z-20 cursor-not-allowed rounded-[8px] bg-black/50" />
        <Surface className="bg-card w-full rounded-[8px] p-[16px]">
          <h4 className="mb-[8px] text-[18px] font-semibold">Select asset</h4>
          <TokenAmountInput
            hideBalance={fromAsset?.id === 'btc-native'}
            balances={balances.state === 'hasData' ? balances.data : undefined}
            assets={fromAssets.state === 'hasData' ? fromAssets.data : undefined}
            amount={fromAmount}
            onChangeAmount={setFromAmount}
            leadingLabel="You're paying"
            evmAddress={fromEvmAccount?.address as `0x${string}`}
            substrateAddress={fromSubstrateAccount?.address}
            selectedAsset={fromAsset}
            availableBalance={fastBalance?.balance?.transferrable}
            stayAliveBalance={fastBalance?.balance?.stayAlive}
            onChangeAsset={handleChangeFromAsset}
            disableBtc
            searchAtom={swapFromSearchAtom}
            priorityMode="buy"
          />
          <div className="relative h-[12px] w-full">
            <TonalIconButton
              className="border-3 absolute -top-[8px] left-1/2 z-10 !h-[48px] !w-[48px] -translate-x-1/2 !rounded-full !border-solid !border-gray-900 !bg-[#2D3121]"
              onClick={reverse}
            >
              <Repeat />
            </TonalIconButton>
          </div>
          <TokenAmountInput
            balances={balances.state === 'hasData' ? balances.data : undefined}
            amount={cachedToAmount ?? undefined}
            assets={toAssets.state === 'hasData' ? toAssets.data : undefined}
            leadingLabel="You're receiving"
            selectedAsset={toAsset}
            onChangeAsset={handleChangeToAsset}
            evmAddress={fromEvmAccount?.address as `0x${string}`}
            substrateAddress={fromSubstrateAccount?.address}
            disabled
            hideBalance
            searchAtom={swapToSearchAtom}
            usdOverride={toAmountUsdOverride}
            priorityMode="sell"
          />
        </Surface>
        <FromAccount
          fastBalance={
            fromAsset && fastBalance?.balance
              ? {
                  amount: fastBalance?.balance.transferrable,
                  chainId: fromAsset.chainId,
                }
              : undefined
          }
        />
        <Button className="!w-full !rounded-[8px]" disabled={true} loading={false}>
          Swap
        </Button>
      </div>
      <SidePanel />
    </div>
  )
}
