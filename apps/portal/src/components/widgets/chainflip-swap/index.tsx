import { walletConnectionSideSheetOpenState } from '../WalletConnectionSideSheet'
import { FromAccount } from './FromAccount'
import { TokenAmountInput } from './TokenAmountInput'
import { shouldFocusDetailsAtom, SidePanel, swapInfoTabAtom } from './side-panel'
import { fromAssetsBalancesAtom } from './swap-balances.api'
import {
  fromAddressAtom,
  fromAmountAtom,
  fromAssetAtom,
  SwappableAssetWithDecimals,
  swapQuoteRefresherAtom,
  toAddressAtom,
  toAssetAtom,
} from './swap-modules/common.swap-module'
import { swapFromSearchAtom, swapQuotesAtom, swapToSearchAtom, useSwapErc20Approval } from './swaps.api'
import {
  fromAssetsAtom,
  selectedQuoteAtom,
  toAmountAtom,
  toAssetsAtom,
  useFromAccount,
  useReverse,
  useSwap,
  useSyncPreviousChainflipSwaps,
  useToAccount,
} from './swaps.api'
import { useSetJotaiSubstrateApiState } from '@/domains/common'
import { useFastBalance, UseFastBalanceProps } from '@/hooks/useFastBalance'
import { Button, Surface, TonalIconButton } from '@talismn/ui'
import { Repeat } from '@talismn/web-icons'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { loadable } from 'jotai/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type React from 'react'
import { useSetRecoilState } from 'recoil'

export const ChainFlipSwap: React.FC = () => {
  useSetJotaiSubstrateApiState()
  useSyncPreviousChainflipSwaps()

  const setInfoTab = useSetAtom(swapInfoTabAtom)
  const [shouldFocusDetails, setShouldFocusDetails] = useAtom(shouldFocusDetailsAtom)
  const setQuoteRefresher = useSetAtom(swapQuoteRefresherAtom)
  const setWalletConnectionSideSheetOpen = useSetRecoilState(walletConnectionSideSheetOpenState)
  const quote = useAtomValue(loadable(selectedQuoteAtom))

  const fromAddress = useAtomValue(fromAddressAtom)
  const [fromAsset, setFromAsset] = useAtom(fromAssetAtom)
  const [fromAmount, setFromAmount] = useAtom(fromAmountAtom)
  useToAccount()
  const { ethAccounts, substrateAccounts, fromEvmAccount, fromEvmAddress, fromSubstrateAccount, fromSubstrateAddress } =
    useFromAccount()
  const toAddress = useAtomValue(toAddressAtom)
  const [toAsset, setToAsset] = useAtom(toAssetAtom)

  const toAmount = useAtomValue(loadable(toAmountAtom))
  const fromAssets = useAtomValue(loadable(fromAssetsAtom))
  const toAssets = useAtomValue(loadable(toAssetsAtom))
  const [cachedToAmount, setCachedToAmount] = useState(toAmount.state === 'hasData' ? toAmount.data : undefined)
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

  const { swap, swapping } = useSwap()
  const reverse = useReverse()

  const handleChangeFromAsset = useCallback(
    (asset: SwappableAssetWithDecimals | null) => {
      if (asset && toAsset && asset.id === toAsset.id) reverse()
      else setFromAsset(asset)
    },
    [reverse, setFromAsset, toAsset]
  )

  const handleChangeToAsset = useCallback(
    (asset: SwappableAssetWithDecimals | null) => {
      if (asset && fromAsset && asset.id === fromAsset.id) reverse()
      else setToAsset(asset)
    },
    [fromAsset, reverse, setToAsset]
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

  const insufficientBalance = useMemo(() => {
    if (!fastBalance?.balance) return undefined
    return fromAmount.planck > fastBalance.balance.transferrable.planck
  }, [fastBalance, fromAmount.planck])

  const { data: approvalData, loading: approvalLoading, approve, approving } = useSwapErc20Approval()

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
    <div className="w-full flex flex-col md:flex-row mb-[40px]">
      <div className="grid gap-[8px] w-full relative">
        <Surface className="bg-card p-[16px] rounded-[8px] w-full">
          <h4 className="text-[18px] font-semibold mb-[8px]">Select Asset</h4>
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
          />
          <div className="relative w-full h-[12px]">
            <TonalIconButton
              className="border-3 !border-solid !border-gray-900 -top-[8px] absolute z-10 left-1/2 -translate-x-1/2 !bg-[#2D3121] !w-[48px] !h-[48px] !rounded-full"
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
        {substrateAccounts.length === 0 && ethAccounts.length === 0 ? (
          <Button className="!w-full !rounded-[8px]" onClick={() => setWalletConnectionSideSheetOpen(true)}>
            Connect Wallet
          </Button>
        ) : fromAsset?.networkType === 'btc' ? (
          <Button className="!w-full !rounded-[8px]" disabled>
            Swapping from BTC is not supported
          </Button>
        ) : fromAsset?.networkType === 'evm' && ethAccounts.length === 0 ? (
          <Button className="!w-full !rounded-[8px]" onClick={() => setWalletConnectionSideSheetOpen(true)}>
            Connect Ethereum Wallet
          </Button>
        ) : fromAsset?.networkType === 'substrate' && substrateAccounts.length === 0 ? (
          <Button className="!w-full !rounded-[8px]" onClick={() => setWalletConnectionSideSheetOpen(true)}>
            Connect Polkadot Wallet
          </Button>
        ) : approvalData ? (
          <Button loading={approving} disabled={approving} onClick={approve} className="!w-full !rounded-[8px]">
            Allow {approvalData.protocolName} to spend {fromAsset?.symbol}
          </Button>
        ) : (
          <Button
            className="!w-full !rounded-[8px]"
            disabled={
              toAmount.state !== 'hasData' ||
              !toAmount.data ||
              toAmount.data.planck === 0n ||
              !fromAddress ||
              !toAddress ||
              insufficientBalance !== false ||
              swapping ||
              approvalLoading
            }
            loading={swapping || approvalLoading}
            onClick={() => {
              setInfoTab('details')
              if (
                quote.state === 'hasData' &&
                quote.data &&
                fastBalance?.balance &&
                quote.data.quote.state === 'hasData' &&
                quote.data.quote.data
              ) {
                swap(quote.data.quote.data.protocol, fromAmount.planck > fastBalance.balance.stayAlive.planck)
              }
            }}
          >
            Swap
          </Button>
        )}
      </div>
      <SidePanel />
    </div>
  )
}
