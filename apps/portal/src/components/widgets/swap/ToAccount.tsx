import type React from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { isAddress as isEvmAddress } from 'viem'

import { SeparatedAccountSelector } from '@/components/widgets/SeparatedAccountSelector'
import { isBtcAddress } from '@/util/btc'
import { cn } from '@/util/cn'

import {
  toAddressAtom,
  toAssetAtom,
  toBtcAddressAtom,
  toEvmAddressAtom,
  toSubstrateAddressAtom,
} from './swap-modules/common.swap-module'

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
            if (!address) return setEvmAddress(null), setSubstrate(null), setBtcAddress(null)

            if (isBtcAddress(address)) return setEvmAddress(null), setSubstrate(null), setBtcAddress(address)
            if (isEvmAddress(address)) return setEvmAddress(address), setSubstrate(null), setBtcAddress(null)
            return setEvmAddress(null), setSubstrate(address), setBtcAddress(null)
          }}
        />
      )}
    </div>
  )
}
