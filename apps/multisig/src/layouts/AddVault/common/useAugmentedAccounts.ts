import { useEffect, useMemo, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { accountsState } from '../../../domains/extension'
import { selectedAccountState } from '../../../domains/auth'
import { Address } from '../../../util/addresses'

export const useAugmentedAccounts = () => {
  const [addedAccounts, setAddedAccounts] = useState<Address[]>([])
  const [extensionAccounts] = useRecoilState(accountsState)
  const selectedSigner = useRecoilValue(selectedAccountState)

  const augmentedAccounts = useMemo(() => {
    const augmentedAddedAccounts = addedAccounts.map(a => {
      const extensionAccount = extensionAccounts.find(ea => ea.address.isEqual(a))
      if (!extensionAccount) return { address: a }
      return {
        address: a,
        nickname: extensionAccount.meta.name,
        you: true,
        injected: extensionAccount,
      }
    })

    return selectedSigner
      ? [
          {
            address: selectedSigner.injected.address,
            nickname: selectedSigner.injected.meta.name,
            you: true,
            injected: selectedSigner.injected,
          },
          ...augmentedAddedAccounts,
        ]
      : augmentedAddedAccounts
  }, [addedAccounts, extensionAccounts, selectedSigner])

  // remove selected signer from addedAcounts list to prevent duplicate
  useEffect(() => {
    if (!selectedSigner) return

    const selectedSignerIndex = addedAccounts.findIndex(a => a.isEqual(selectedSigner.injected.address))
    if (selectedSignerIndex === -1) return

    setAddedAccounts(addedAccounts => {
      const newAddedAccounts = [...addedAccounts]
      newAddedAccounts.splice(selectedSignerIndex, 1)
      return newAddedAccounts
    })
  }, [addedAccounts, augmentedAccounts, selectedSigner, setAddedAccounts])

  return { addedAccounts, augmentedAccounts, setAddedAccounts }
}
