import { toAddressAtom, toAssetAtom, toEvmAddressAtom, toSubstrateAddressAtom } from './swap-modules/common.swap-module'
import { SeparatedAccountSelector } from '@/components/SeparatedAccountSelector'
import { cn } from '@/lib/utils'
import { useTokens } from '@talismn/balances-react'
import { useAtomValue, useSetAtom } from 'jotai'
import type React from 'react'
import { useMemo } from 'react'
import { isAddress } from 'viem'

export const ToAccount: React.FC = () => {
  const toAsset = useAtomValue(toAssetAtom)
  const toAddress = useAtomValue(toAddressAtom)
  const setEvmAddress = useSetAtom(toEvmAddressAtom)
  const setSubstrate = useSetAtom(toSubstrateAddressAtom)
  const tokens = useTokens()

  const token = useMemo(() => {
    if (!toAsset) return null
    return tokens[toAsset.id]
  }, [toAsset, tokens])

  return (
    <div className="w-full">
      <p className={cn('text-[14px] text-gray-500')}>Destination Account</p>
      {toAsset && (
        <SeparatedAccountSelector
          allowInput
          accountsType={!token ? 'all' : token?.evmNetwork ? 'ethereum' : 'substrate'}
          substrateAccountsFilter={a => !a.readonly}
          substrateAccountPrefix={0}
          value={toAddress}
          onAccountChange={address => {
            if (address) {
              isAddress(address) ? setEvmAddress(address) : setSubstrate(address)
            } else {
              setEvmAddress(null)
              setSubstrate(null)
            }
          }}
        />
      )}
    </div>
  )
}
