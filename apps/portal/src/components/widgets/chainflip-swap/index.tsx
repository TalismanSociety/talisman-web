import { writeableAccountsState } from '../../../domains/accounts'
import { useAccountSelector } from '../AccountSelector'
import { walletConnectionSideSheetOpenState } from '../WalletConnectionSideSheet'
import { TokenSelector } from './TokenSelector'
import { SidePanel } from './side-panel'
import { Button, Surface, TextInput, TonalIconButton } from '@talismn/ui'
import { Repeat } from '@talismn/web-icons'
import type React from 'react'
import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

export const ChainFlipSwap: React.FC = () => {
  const accounts = useRecoilValue(writeableAccountsState)
  const [[originAccount, setOriginAccount], accountSelector] = useAccountSelector(
    accounts.filter(a => !a.readonly),
    undefined,
    undefined,
    true
  )
  const setWalletConnectionSideSheetOpen = useSetRecoilState(walletConnectionSideSheetOpenState)

  useEffect(() => {
    if (accounts.length > 0 && !originAccount) setOriginAccount(accounts[0])
  }, [accounts, originAccount, setOriginAccount])

  return (
    <div className="w-full flex items-stretch flex-col md:flex-row">
      <div className="grid gap-[8px] w-full">
        <Surface className="bg-card p-[16px] rounded-[8px] w-full">
          <h4 className="text-[16px] font-semibold">From Account</h4>
          {accountSelector}
        </Surface>
        <Surface className="bg-card p-[16px] rounded-[8px] w-full">
          <h4 className="text-[16px] font-semibold mb-[8px]">Select Asset</h4>
          <TextInput
            leadingLabel="You're paying"
            placeholder="0.00"
            trailingIcon={
              <div className="flex items-center gap-[8px] justify-end">
                <TextInput.LabelButton css={{ fontSize: 12, paddingTop: 4, paddingBottom: 4 }}>
                  <p css={{ fontSize: 12, lineHeight: 1 }}>Max</p>
                </TextInput.LabelButton>
                <TokenSelector selectedAssetId="" />
              </div>
            }
          />
          <div className="relative w-full h-[8px]">
            <TonalIconButton className="border-3 !border-solid !border-gray-900 -top-[6px] absolute z-10 left-1/2 -translate-x-1/2 !bg-[#2D3121] !w-[48px] !h-[48px] !rounded-full">
              <Repeat />
            </TonalIconButton>
          </div>
          <TextInput leadingLabel="To receive" placeholder="0.00" />
        </Surface>
        <div className="bg-card p-[16px] rounded-[8px] w-full">
          <h4 className="text-[16px] font-semibold">To Account</h4>
        </div>

        {accounts.length === 0 ? (
          <Button className="!w-full !rounded-[8px]" onClick={() => setWalletConnectionSideSheetOpen(true)}>
            Connect Wallet
          </Button>
        ) : (
          <Button className="!w-full !rounded-[8px]">Swap</Button>
        )}
      </div>
      <SidePanel />
    </div>
  )
}
