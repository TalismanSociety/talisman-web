import { wagmiAccountsState, writeableSubstrateAccountsState } from '../../../domains/accounts'
import { walletConnectionSideSheetOpenState } from '../WalletConnectionSideSheet'
import { FromAccount } from './FromAccount'
import { FromAmount } from './FromAmount'
import { ToAccount } from './ToAccount'
import { ToAmount } from './ToAmount'
import { shouldFocusDetailsAtom, SidePanel, swapInfoTabAtom } from './side-panel'
import { fromAmountAtom, fromAmountInputAtom, fromAssetAtom, toAssetAtom } from './swap-modules/common.swap-module'
import { fromAccountState, quoteRefresherState, toAddressState, useLoadTokens, useSwap } from './swap.api'
import { toAmountAtom, useAssetToken, useReverse } from './swaps.api'
import { useBalances } from '@talismn/balances-react'
import { Decimal } from '@talismn/math'
import { Button, Surface, TonalIconButton } from '@talismn/ui'
import { Repeat } from '@talismn/web-icons'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { loadable } from 'jotai/utils'
import { useEffect, useMemo } from 'react'
import type React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

/**
 * TODO:
 * - handle polkadot ED
 */
export const ChainFlipSwap: React.FC = () => {
  useLoadTokens()
  const setWalletConnectionSideSheetOpen = useSetRecoilState(walletConnectionSideSheetOpenState)
  const accounts = useRecoilValue(writeableSubstrateAccountsState)
  const ethAccount = useRecoilValue(wagmiAccountsState)
  const { swap, swapping } = useSwap()

  const fromAccount = useRecoilValue(fromAccountState)

  const toAddress = useRecoilValue(toAddressState)
  const setInfoTab = useSetAtom(swapInfoTabAtom)
  const [shouldFocusDetails, setShouldFocusDetails] = useAtom(shouldFocusDetailsAtom)
  const reverse = useReverse()

  const fromAmountInput = useAtomValue(fromAmountInputAtom)
  const fromAmount = useAtomValue(fromAmountAtom)
  const toAmount = useAtomValue(loadable(toAmountAtom))

  const fromAsset = useAtomValue(fromAssetAtom)
  const toAsset = useAtomValue(toAssetAtom)
  const balances = useBalances()
  const fromToken = useAssetToken(fromAssetAtom)

  const availableBalance = useMemo(() => {
    if (!fromAccount || !fromAsset) return null
    const balance = balances.find(
      b => b.tokenId === fromAsset.id && b.address.toLowerCase() === fromAccount.address.toLowerCase()
    )
    return {
      balance: Decimal.fromPlanck(balance.sum.planck.transferable, fromAsset.decimals, { currency: fromAsset.symbol }),
      loading: balance.find(b => b.status === 'stale').each.length !== 0,
    }
  }, [balances, fromAccount, fromAsset])

  const insufficientBalance = useMemo(() => {
    if (!availableBalance || availableBalance.loading) return undefined
    return fromAmount.planck > availableBalance.balance.planck
  }, [availableBalance, fromAmount.planck])

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
  }, [fromAmountInput, fromAsset, toAsset, setShouldFocusDetails])

  // // bring user back to details page to wait for quote
  useEffect(() => {
    if (toAmount.state === 'loading' && shouldFocusDetails && !swapping) {
      setShouldFocusDetails(false)
      setInfoTab('details')
    }
  }, [toAmount, setInfoTab, shouldFocusDetails, setShouldFocusDetails, swapping])

  return (
    <div className="w-full flex flex-col md:flex-row mb-[40px]">
      <div className="grid gap-[8px] w-full">
        <Surface className="bg-card p-[16px] rounded-[8px] w-full">
          <h4 className="text-[18px] font-semibold mb-[8px]">Select Asset</h4>
          <FromAmount availableBalance={availableBalance} />
          <div className="relative w-full h-[8px]">
            <TonalIconButton
              className="border-3 !border-solid !border-gray-900 -top-[8px] absolute z-10 left-1/2 -translate-x-1/2 !bg-[#2D3121] !w-[48px] !h-[48px] !rounded-full"
              onClick={reverse}
            >
              <Repeat />
            </TonalIconButton>
          </div>
          <ToAmount />
        </Surface>
        <FromAccount />
        <ToAccount />
        {/* <FromAccount assetAndChain={assetAndChain} />
        <ToAccount assetAndChain={assetAndChain} /> */}
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
