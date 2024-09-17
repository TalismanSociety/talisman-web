import {
  toAddressAtom,
  toAssetAtom,
  toBtcAddressAtom,
  toEvmAddressAtom,
  toSubstrateAddressAtom,
} from './swap-modules/common.swap-module'
import { SeparatedAccountSelector } from '@/components/SeparatedAccountSelector'
import { isBtcAddress } from '@/lib/btc'
import { cn } from '@/lib/utils'
import { useAtomValue, useSetAtom } from 'jotai'
import type React from 'react'
import { isAddress } from 'viem'

export const ToAccount: React.FC = () => {
  const toAsset = useAtomValue(toAssetAtom)
  const toAddress = useAtomValue(toAddressAtom)
  const setEvmAddress = useSetAtom(toEvmAddressAtom)
  const setSubstrate = useSetAtom(toSubstrateAddressAtom)
  const setBtcAddress = useSetAtom(toBtcAddressAtom)

  return (
    <div className="w-full">
      <p className={cn('text-[14px] text-gray-500')}>Destination Account</p>
      {toAsset && (
        <SeparatedAccountSelector
          allowInput
          accountsType={
            toAsset.id === 'btc-native'
              ? 'btc'
              : !toAsset
              ? 'all'
              : toAsset.networkType === 'evm'
              ? 'ethereum'
              : 'substrate'
          }
          substrateAccountsFilter={a => !a.readonly}
          substrateAccountPrefix={0}
          value={toAddress}
          onAccountChange={address => {
            if (address) {
              if (isBtcAddress(address)) {
                setBtcAddress(address)
              } else if (isAddress(address)) {
                setEvmAddress(address)
              } else {
                setSubstrate(address)
              }
            } else {
              setEvmAddress(null)
              setSubstrate(null)
              setBtcAddress(null)
            }
          }}
        />
      )}
    </div>
  )
}
