import { writeableAccountsState } from '../../../domains/accounts'
import { useAccountSelector } from '../AccountSelector'
import { walletConnectionSideSheetOpenState } from '../WalletConnectionSideSheet'
import { TokenSelector } from './TokenSelector'
import { fromAmountErrorState, fromAmountInputState, toAmountState, useAssetAndChain } from './api'
import { SidePanel } from './side-panel'
import { Button, Surface, TextInput, toast, TonalIconButton } from '@talismn/ui'
import { Repeat } from '@talismn/web-icons'
import type React from 'react'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil'

/**
 * TODO:
 * - track swaps and display in activities (steal from old implementation)
 * - show balance or '-' when address isnt selected in token selector
 * - display available balance
 * - display insufficient error balance
 * - refresh quote after some time (auto refresh quote every X seconds, any change to the parameters should trigger instant refresh)
 * - empty tokens list message in token selector pop up (e.g. when source isnt selected and user clicks dest, it should show "Please selct they asset you'r paying first")
 */
export const ChainFlipSwap: React.FC = () => {
  const accounts = useRecoilValue(writeableAccountsState)
  const setWalletConnectionSideSheetOpen = useSetRecoilState(walletConnectionSideSheetOpenState)
  const [[fromAccount, setFromAccount], fromAccountSelector] = useAccountSelector(
    accounts.filter(a => !a.readonly),
    undefined,
    undefined,
    true
  )
  const [[toAccount, setToAccount], toAccountSelector] = useAccountSelector(
    accounts.filter(
      a =>
        !a.readonly &&
        (!fromAccount ||
          // when from is ethereum account, allow non-ethereum account
          (fromAccount.type === 'ethereum' && a.type !== 'ethereum') ||
          // when from is non ethereum account, allow ethereum account
          (fromAccount.type !== 'ethereum' && a.type === 'ethereum'))
    ),
    undefined,
    undefined,
    true
  )
  const [fromAmountInput, setFromAmountInput] = useRecoilState(fromAmountInputState)
  const fromAmountError = useRecoilValueLoadable(fromAmountErrorState)
  const toAmountLoadable = useRecoilValueLoadable(toAmountState)
  const assetAndChain = useAssetAndChain(
    fromAccount,
    toAccount,
    setToAccount,
    ({ newSrcAssetSymbol, newDestAssetSymbol }) => {
      if (newSrcAssetSymbol === null || newDestAssetSymbol === null) return
      toast(
        <p className="text-[14px]">
          Swapping <span className="font-bold">{newSrcAssetSymbol}</span> to{' '}
          <span className="font-bold">{newDestAssetSymbol}</span>
        </p>
      )
    }
  )

  return (
    <div className="w-full flex items-stretch flex-col md:flex-row mb-[40px]">
      <div className="grid gap-[8px] w-full">
        <Surface className="bg-card p-[16px] rounded-[8px] w-full">
          <h4 className="text-[16px] font-semibold">From Account</h4>
          {fromAccountSelector}
        </Surface>
        <Surface className="bg-card p-[16px] rounded-[8px] w-full">
          <h4 className="text-[16px] font-semibold mb-[8px]">Select Asset</h4>
          <TextInput
            leadingLabel="You're paying"
            placeholder="0.00"
            containerClassName="[&>div:nth-child(2)]:!py-[8px] [&>div]:!pr-[8px]"
            value={fromAmountInput}
            onChangeText={setFromAmountInput}
            inputMode="decimal"
            type="number"
            trailingIcon={
              <div className="flex items-center gap-[8px] justify-end">
                <TextInput.LabelButton css={{ fontSize: 12, paddingTop: 4, paddingBottom: 4 }}>
                  <p css={{ fontSize: 12, lineHeight: 1 }}>Max</p>
                </TextInput.LabelButton>
                <TokenSelector
                  selectedAssetSymbol={assetAndChain.srcAssetSymbol}
                  selectedAssetChain={assetAndChain.srcAssetChain}
                  onSelectToken={token => {
                    assetAndChain.setSrcAssetSymbol(token.code)
                    assetAndChain.setSrcAssetChain(token.chainId)

                    if (fromAccount) {
                      if (token.chain === 'Ethereum' && fromAccount.type !== 'ethereum') {
                        setFromAccount(undefined)
                        assetAndChain.setDestAssetChain(assetAndChain.srcAssetChain)
                        assetAndChain.setDestAssetSymbol(assetAndChain.srcAssetSymbol)
                        toast('Please swap from an Ethereum account.')
                      }

                      if (token.chain === 'Polkadot' && fromAccount.type === 'ethereum') {
                        setFromAccount(undefined)
                        toast('Please swap from a Polkadot account.')
                      }
                    }
                  }}
                />
              </div>
            }
          />
          <div className="relative w-full h-[8px]">
            <TonalIconButton
              className="border-3 !border-solid !border-gray-900 -top-[6px] absolute z-10 left-1/2 -translate-x-1/2 !bg-[#2D3121] !w-[48px] !h-[48px] !rounded-full"
              onClick={assetAndChain.reverse}
            >
              <Repeat />
            </TonalIconButton>
          </div>
          <TextInput
            containerClassName="[&>div:nth-child(2)]:!py-[8px] [&>div]:!pr-[8px]"
            leadingLabel="To receive"
            placeholder="0.00"
            inputMode="decimal"
            type="number"
            disabled
            value={toAmountLoadable.state === 'hasValue' ? toAmountLoadable.contents?.toString() ?? '' : ''}
            trailingIcon={
              <TokenSelector
                selectedAssetSymbol={assetAndChain.destAssetSymbol}
                selectedAssetChain={assetAndChain.destAssetChain}
                assetFilter={a => {
                  if (assetAndChain.srcAssetChain === null) return false
                  return a.chain !== assetAndChain.srcAssetChain
                }}
                onSelectToken={token => {
                  assetAndChain.setDestAssetSymbol(token.code)
                  assetAndChain.setDestAssetChain(token.chainId)
                }}
              />
            }
          />
        </Surface>
        <Surface className="bg-card p-[16px] rounded-[8px] w-full">
          <h4 className="text-[16px] font-semibold">To Account</h4>
          {toAccountSelector}
        </Surface>

        {accounts.length === 0 ? (
          <Button className="!w-full !rounded-[8px]" onClick={() => setWalletConnectionSideSheetOpen(true)}>
            Connect Wallet
          </Button>
        ) : (
          <Button
            className="!w-full !rounded-[8px]"
            disabled={
              toAmountLoadable.state !== 'hasValue' ||
              !toAmountLoadable.contents ||
              !fromAccount ||
              !toAccount ||
              fromAmountError.state !== 'hasValue' ||
              fromAmountError.contents !== null
            }
          >
            Swap
          </Button>
        )}
      </div>
      <SidePanel />
    </div>
  )
}
