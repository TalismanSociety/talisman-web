import { wagmiAccountsState, writeableSubstrateAccountsState } from '../../../domains/accounts'
import { walletConnectionSideSheetOpenState } from '../WalletConnectionSideSheet'
import { FromAccount } from './FromAccount'
import { ToAccount } from './ToAccount'
import { TokenAmountInput } from './TokenAmountInput'
import { shouldFocusDetailsAtom, SidePanel, swapInfoTabAtom } from './side-panel'
import {
  fromAddressAtom,
  fromAmountAtom,
  fromAssetAtom,
  fromEvmAddressAtom,
  fromSubstrateAddressAtom,
  swapQuoteRefresherAtom,
  toAddressAtom,
  toAssetAtom,
} from './swap-modules/common.swap-module'
import {
  fromAssetsAtom,
  swapQuoteAtom,
  toAmountAtom,
  toAssetsAtom,
  useReverse,
  useSwap,
  useSyncPreviousChainflipSwaps,
} from './swaps.api'
import { useFastBalance, UseFastBalanceProps } from '@/hooks/useFastBalance'
import { Button, Surface, TonalIconButton } from '@talismn/ui'
import { Repeat } from '@talismn/web-icons'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { loadable } from 'jotai/utils'
import { useEffect, useMemo } from 'react'
import type React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

export const ChainFlipSwap: React.FC = () => {
  useSyncPreviousChainflipSwaps()
  const quote = useAtomValue(swapQuoteAtom)
  const setQuoteRefresher = useSetAtom(swapQuoteRefresherAtom)
  const setWalletConnectionSideSheetOpen = useSetRecoilState(walletConnectionSideSheetOpenState)
  const substrateAccounts = useRecoilValue(writeableSubstrateAccountsState)
  const ethAccount = useRecoilValue(wagmiAccountsState)

  const setInfoTab = useSetAtom(swapInfoTabAtom)
  const [shouldFocusDetails, setShouldFocusDetails] = useAtom(shouldFocusDetailsAtom)

  const fromAddress = useAtomValue(fromAddressAtom)
  const [fromAmount, setFromAmount] = useAtom(fromAmountAtom)
  const [fromEvmAddress, setFromEvmAddress] = useAtom(fromEvmAddressAtom)
  const [fromSubstrateAddress, setFromSubstrateAddress] = useAtom(fromSubstrateAddressAtom)
  const fromEvmAccount = useMemo(
    () => ethAccount.find(a => a.address.toLowerCase() === fromEvmAddress?.toLowerCase()),
    [ethAccount, fromEvmAddress]
  )
  const fromSubstrateAccount = useMemo(
    () => substrateAccounts.find(a => a.address.toLowerCase() === fromSubstrateAddress?.toLowerCase()),
    [fromSubstrateAddress, substrateAccounts]
  )
  const [fromAsset, setFromAsset] = useAtom(fromAssetAtom)
  const [toAsset, setToAsset] = useAtom(toAssetAtom)

  useEffect(() => {
    if (!fromEvmAccount && ethAccount.length > 0) setFromEvmAddress((ethAccount[0]?.address as `0x${string}`) ?? null)
    if (!fromSubstrateAccount && substrateAccounts.length > 0)
      setFromSubstrateAddress(substrateAccounts[0]?.address ?? null)
  }, [
    ethAccount,
    fromAsset,
    fromEvmAccount,
    fromSubstrateAccount,
    setFromEvmAddress,
    setFromSubstrateAddress,
    substrateAccounts,
  ])

  const toAddress = useAtomValue(toAddressAtom)
  const toAmount = useAtomValue(loadable(toAmountAtom))
  const fromAssets = useAtomValue(loadable(fromAssetsAtom))
  const toAssets = useAtomValue(loadable(toAssetsAtom))

  const { swap, swapping } = useSwap()
  const reverse = useReverse()

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

  useEffect(() => {
    if (fromAmount.planck > 0n && fromAsset && toAsset) setShouldFocusDetails(true)
  }, [fromAsset, toAsset, setShouldFocusDetails, fromAmount.planck])

  // refresh quote every 15 seconds
  useEffect(() => {
    if (swapping) return
    const id = setInterval(() => {
      setShouldFocusDetails(false)
      setQuoteRefresher(new Date().getTime())
    }, 15_000)
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
            assets={fromAssets.state === 'hasData' ? fromAssets.data : undefined}
            amount={fromAmount}
            onChangeAmount={setFromAmount}
            leadingLabel="You're paying"
            evmAddress={fromEvmAccount?.address as `0x${string}`}
            substrateAddress={fromSubstrateAccount?.address}
            selectedAsset={fromAsset}
            availableBalance={fastBalance?.balance?.transferrable}
            stayAliveBalance={fastBalance?.balance?.stayAlive}
            onChangeAsset={setFromAsset}
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
            assets={toAssets.state === 'hasData' ? toAssets.data : undefined}
            leadingLabel="You're receiving"
            selectedAsset={toAsset}
            onChangeAsset={setToAsset}
            disabled
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
        <ToAccount />
        {substrateAccounts.length === 0 && ethAccount.length === 0 ? (
          <Button className="!w-full !rounded-[8px]" onClick={() => setWalletConnectionSideSheetOpen(true)}>
            Connect Wallet
          </Button>
        ) : fromAsset?.networkType === 'evm' && ethAccount.length === 0 ? (
          <Button className="!w-full !rounded-[8px]" onClick={() => setWalletConnectionSideSheetOpen(true)}>
            Connect Ethereum Wallet
          </Button>
        ) : fromAsset?.networkType === 'substrate' && substrateAccounts.length === 0 ? (
          <Button className="!w-full !rounded-[8px]" onClick={() => setWalletConnectionSideSheetOpen(true)}>
            Connect Polkadot Wallet
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
              swapping
            }
            loading={swapping}
            onClick={() => {
              setInfoTab('details')
              if (quote.state === 'hasData' && quote.data && fastBalance?.balance) {
                swap(quote.data.protocol, fromAmount.planck > fastBalance.balance.stayAlive.planck)
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
