import { toAddressState, useAssetAndChain } from './api'
import { SeparatedAccountSelector } from '@/components/SeparatedAccountSelector'
import { Surface } from '@talismn/ui'
import type React from 'react'
import { useMemo } from 'react'
import { useRecoilState } from 'recoil'

export const ToAccount: React.FC<{ assetAndChain: ReturnType<typeof useAssetAndChain> }> = ({ assetAndChain }) => {
  const [toAddess, setToAddress] = useRecoilState(toAddressState)

  const allowedAccountsType = useMemo(() => {
    if (assetAndChain.destAssetChain) {
      return assetAndChain.destAssetChain === 'Polkadot' ? 'substrate' : 'ethereum'
    }
    if (assetAndChain.srcAssetChain) {
      return assetAndChain.srcAssetChain === 'Polkadot' ? 'ethereum' : 'substrate'
    }
    return 'all'
  }, [assetAndChain])

  return (
    <Surface className="bg-card p-[16px] rounded-[8px] w-full">
      <h4 className="text-[16px] font-semibold">To Account</h4>
      <SeparatedAccountSelector
        allowInput
        accountsType={allowedAccountsType}
        substrateAccountsFilter={a => !a.readonly}
        substrateAccountPrefix={0}
        value={toAddess}
        onAccountChange={setToAddress}
      />
    </Surface>
  )
}
