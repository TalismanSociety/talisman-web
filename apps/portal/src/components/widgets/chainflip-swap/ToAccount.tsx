import { fromAddressAtom, toAddressAtom, toAssetAtom } from './swap-modules/common.swap-module'
import { selectCustomAddressAtom } from './swaps.api'
import { SeparatedAccountSelector } from '@/components/SeparatedAccountSelector'
import { cn } from '@/lib/utils'
import { useTokens } from '@talismn/balances-react'
import { Surface } from '@talismn/ui'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import type React from 'react'
import { useMemo } from 'react'

export const ToAccount: React.FC = () => {
  const toAsset = useAtomValue(toAssetAtom)
  const fromAddress = useAtomValue(fromAddressAtom)
  const [toAddess, setToAddress] = useAtom(toAddressAtom)
  const tokens = useTokens()
  const setSelectCustomAddress = useSetAtom(selectCustomAddressAtom)

  const token = useMemo(() => {
    if (!toAsset) return null
    return tokens[toAsset.id]
  }, [toAsset, tokens])

  const shouldShowToAccount = useMemo(() => {
    return !!toAsset && fromAddress && (fromAddress !== toAddess || !toAddess)
  }, [fromAddress, toAddess, toAsset])
  if (!toAsset) return null

  if (!shouldShowToAccount) return null

  return (
    <Surface className="bg-card p-[16px] rounded-[8px] w-full">
      <div className="flex items-center justify-between">
        <h4 className={cn('text-[16px]', toAsset ? 'font-semibold' : 'text-gray-500')}>Send to wallet</h4>
      </div>
      {toAsset && (
        <SeparatedAccountSelector
          allowInput
          accountsType={!token ? 'all' : token?.evmNetwork ? 'ethereum' : 'substrate'}
          substrateAccountsFilter={a => !a.readonly}
          substrateAccountPrefix={0}
          value={toAddess}
          onAccountChange={address => {
            setToAddress(address)
            if (!address) setSelectCustomAddress(true)
          }}
        />
      )}
    </Surface>
  )
}
