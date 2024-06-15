import { wagmiAccountsState, writeableSubstrateAccountsState } from '../../../domains/accounts'
import { walletConnectionSideSheetOpenState } from '../WalletConnectionSideSheet'
import { FromAccount } from './FromAccount'
import { FromAmount } from './FromAmount'
import { ToAccount } from './ToAccount'
import { ToAmount } from './ToAmount'
import {
  fromAccountState,
  fromAmountInputState,
  fromAmountState,
  quoteRefresherState,
  toAddressState,
  toAmountState,
  useAssetAndChain,
  useChainflipAssetBalance,
  useSwap,
} from './api'
import { shouldFocusDetailsState, SidePanel, swapInfoTabState } from './side-panel'
import { Button, Surface, toast, TonalIconButton } from '@talismn/ui'
import { Repeat } from '@talismn/web-icons'
import { useEffect, useMemo } from 'react'
import type React from 'react'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil'

/**
 * TODO:
 * - remove ED from available + some fee
 * - empty tokens list message in token selector pop up (e.g. when source isnt selected and user clicks dest, it should show "Please selct they asset you'r paying first")
 * - make sure swaps history is compatible with previous version so users dont lose all past swap record
 */
export const ChainFlipSwap: React.FC = () => {
  const setWalletConnectionSideSheetOpen = useSetRecoilState(walletConnectionSideSheetOpenState)
  const accounts = useRecoilValue(writeableSubstrateAccountsState)
  const ethAccount = useRecoilValue(wagmiAccountsState)
  const { swap, swapping } = useSwap()

  const fromAccount = useRecoilValue(fromAccountState)
  const fromAmountInput = useRecoilValue(fromAmountInputState)
  const fromAmountLoadable = useRecoilValueLoadable(fromAmountState)
  const toAddress = useRecoilValue(toAddressState)
  const toAmountLoadable = useRecoilValueLoadable(toAmountState)
  const setInfoTab = useSetRecoilState(swapInfoTabState)
  const [shouldFocusDetails, setShouldFocusDetails] = useRecoilState(shouldFocusDetailsState)

  const assetAndChain = useAssetAndChain(({ newSrcAssetSymbol, newDestAssetSymbol }) => {
    if (newSrcAssetSymbol === null || newDestAssetSymbol === null) return
    toast(
      <p className="text-[14px]">
        Swapping <span className="font-bold">{newSrcAssetSymbol}</span> to{' '}
        <span className="font-bold">{newDestAssetSymbol}</span>
      </p>
    )
  })

  const fromBalance = useChainflipAssetBalance(
    fromAccount?.address ?? null,
    assetAndChain.fromAssetJson?.symbol,
    assetAndChain.fromAssetJson?.decimals,
    assetAndChain.fromAssetJson?.chain
  )

  const insufficientBalance = useMemo(() => {
    if (!fromBalance || fromBalance.loading || fromAmountLoadable.state !== 'hasValue' || !fromAmountLoadable.contents)
      return undefined
    return fromAmountLoadable.contents.planck > fromBalance.balance.planck
  }, [fromBalance, fromAmountLoadable])

  // refresh quote every 15 seconds
  const setQuoteRefresher = useSetRecoilState(quoteRefresherState)
  useEffect(() => {
    if (swapping) return
    const id = setInterval(() => {
      setShouldFocusDetails(false)
      setQuoteRefresher(prev => prev + 1)
    }, 15_000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapping])

  useEffect(() => {
    setShouldFocusDetails(true)
  }, [fromAmountInput, assetAndChain.destAssetSymbol, assetAndChain.srcAssetSymbol, setShouldFocusDetails])

  // // bring user back to details page to wait for quote
  useEffect(() => {
    if (toAmountLoadable.state === 'loading' && shouldFocusDetails) {
      setShouldFocusDetails(false)
      setInfoTab('details')
    }
  }, [toAmountLoadable, setInfoTab, shouldFocusDetails, setShouldFocusDetails])

  return (
    <div className="w-full flex items-stretch flex-col md:flex-row mb-[40px]">
      <div className="grid gap-[8px] w-full">
        <FromAccount assetAndChain={assetAndChain} />
        <Surface className="bg-card p-[16px] rounded-[8px] w-full">
          <h4 className="text-[16px] font-semibold mb-[8px]">Select Asset</h4>
          <FromAmount assetAndChain={assetAndChain} availableBalance={fromBalance} />
          <div className="relative w-full h-[8px]">
            <TonalIconButton
              className="border-3 !border-solid !border-gray-900 -top-[8px] absolute z-10 left-1/2 -translate-x-1/2 !bg-[#2D3121] !w-[48px] !h-[48px] !rounded-full"
              onClick={assetAndChain.reverse}
            >
              <Repeat />
            </TonalIconButton>
          </div>
          <ToAmount assetAndChain={assetAndChain} />
        </Surface>
        <ToAccount assetAndChain={assetAndChain} />
        {accounts.length === 0 && ethAccount.length === 0 ? (
          <Button className="!w-full !rounded-[8px]" onClick={() => setWalletConnectionSideSheetOpen(true)}>
            Connect Wallet
          </Button>
        ) : assetAndChain.srcAssetChain === 'Ethereum' && ethAccount.length === 0 ? (
          <Button className="!w-full !rounded-[8px]" onClick={() => setWalletConnectionSideSheetOpen(true)}>
            Connect Ethereum Wallet
          </Button>
        ) : assetAndChain.srcAssetChain !== 'Ethereum' && accounts.length === 0 ? (
          <Button className="!w-full !rounded-[8px]" onClick={() => setWalletConnectionSideSheetOpen(true)}>
            Connect Polkadot Wallet
          </Button>
        ) : (
          <Button
            className="!w-full !rounded-[8px]"
            disabled={
              toAmountLoadable.state !== 'hasValue' ||
              !toAmountLoadable.contents ||
              !fromAccount ||
              !toAddress ||
              insufficientBalance !== false ||
              swapping
            }
            loading={swapping}
            onClick={() => {
              setInfoTab('details')
              swap()
            }}
          >
            {insufficientBalance ? 'Insufficient Balance' : 'Swap'}
          </Button>
        )}
      </div>
      <SidePanel />
    </div>
  )
}
