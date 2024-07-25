import { wagmiAccountsState, writeableSubstrateAccountsState } from '../../../domains/accounts'
import { walletConnectionSideSheetOpenState } from '../WalletConnectionSideSheet'
import { FromAccount } from './FromAccount'
import { FromAmount } from './FromAmount'
import { ToAccount } from './ToAccount'
import { ToAmount } from './ToAmount'
import { shouldFocusDetailsAtom, SidePanel, swapInfoTabAtom } from './side-panel'
import {
  fromAddressAtom,
  fromAmountAtom,
  fromAmountInputAtom,
  fromAssetAtom,
  swapQuoteRefresherAtom,
  toAddressAtom,
  toAssetAtom,
} from './swap-modules/common.swap-module'
import {
  swapQuoteAtom,
  toAmountAtom,
  useAccountsController,
  useAssetToken,
  useLoadTokens,
  useReverse,
  useSwap,
  useSyncPreviousChainflipSwaps,
} from './swaps.api'
import { useFastBalance } from '@/hooks/useFastBalance'
import { isAddress as isSubstrateAddress } from '@polkadot/util-crypto'
import { Button, Surface, TonalIconButton } from '@talismn/ui'
import { Repeat } from '@talismn/web-icons'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { loadable } from 'jotai/utils'
import { useEffect, useMemo } from 'react'
import type React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { isAddress } from 'viem'

export const ChainFlipSwap: React.FC = () => {
  useLoadTokens()
  useSyncPreviousChainflipSwaps()
  const quote = useAtomValue(swapQuoteAtom)
  const setQuoteRefresher = useSetAtom(swapQuoteRefresherAtom)
  const setWalletConnectionSideSheetOpen = useSetRecoilState(walletConnectionSideSheetOpenState)
  const accounts = useRecoilValue(writeableSubstrateAccountsState)
  const ethAccount = useRecoilValue(wagmiAccountsState)

  const setInfoTab = useSetAtom(swapInfoTabAtom)
  const [shouldFocusDetails, setShouldFocusDetails] = useAtom(shouldFocusDetailsAtom)

  const fromAddress = useAtomValue(fromAddressAtom)
  const fromAmountInput = useAtomValue(fromAmountInputAtom)
  const fromAmount = useAtomValue(fromAmountAtom)
  const fromAsset = useAtomValue(fromAssetAtom)
  const fromToken = useAssetToken(fromAssetAtom)

  const toAddress = useAtomValue(toAddressAtom)
  const toAmount = useAtomValue(loadable(toAmountAtom))
  const toAsset = useAtomValue(toAssetAtom)
  useAccountsController()

  const { swap, swapping } = useSwap()
  const reverse = useReverse()

  const fastBalance = useFastBalance(
    useMemo(() => {
      if (!fromAsset || !fromAddress) return undefined
      if (fromAsset.chainId === 'polkadot' && !isAddress(fromAddress) && isSubstrateAddress(fromAddress)) {
        return {
          type: 'substrate',
          chainId: fromAsset.chainId,
          address: fromAddress as string,
        }
      }
      if (isAddress(fromAddress))
        return {
          type: 'evm',
          networkId: +fromAsset.chainId,
          address: fromAddress as `0x${string}`,
          tokenAddress: fromAsset.contractAddress as `0x${string}` | undefined,
        }
      return undefined
    }, [fromAddress, fromAsset])
  )

  const insufficientBalance = useMemo(() => {
    if (!fastBalance?.balance) return undefined
    return fromAmount.planck > fastBalance.balance.transferrable.planck
  }, [fastBalance, fromAmount.planck])

  useEffect(() => {
    if (fromAmountInput.trim() !== '' && fromAsset && toAsset) setShouldFocusDetails(true)
  }, [fromAmountInput, fromAsset, toAsset, setShouldFocusDetails])

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

  // // bring user back to details page to wait for quote
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
          <FromAmount
            availableBalance={fastBalance?.balance?.transferrable}
            stayAliveBalance={fastBalance?.balance?.stayAlive}
            insufficientBalance={insufficientBalance}
          />
          <div className="relative w-full h-[12px]">
            <TonalIconButton
              className="border-3 !border-solid !border-gray-900 -top-[8px] absolute z-10 left-1/2 -translate-x-1/2 !bg-[#2D3121] !w-[48px] !h-[48px] !rounded-full"
              onClick={reverse}
            >
              <Repeat />
            </TonalIconButton>
          </div>
          <ToAmount />
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
        {accounts.length === 0 && ethAccount.length === 0 ? (
          <Button className="!w-full !rounded-[8px]" onClick={() => setWalletConnectionSideSheetOpen(true)}>
            Connect Wallet
          </Button>
        ) : fromToken?.isEvm && ethAccount.length === 0 ? (
          <Button className="!w-full !rounded-[8px]" onClick={() => setWalletConnectionSideSheetOpen(true)}>
            Connect Ethereum Wallet
          </Button>
        ) : fromToken && !fromToken.isEvm && accounts.length === 0 ? (
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
