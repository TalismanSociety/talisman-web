import { storageEffect } from '@domains/common/effects'
import { extensionState } from '@domains/extension/recoils'
import { useEffect } from 'react'
import { atom, selector, useRecoilValue, useSetRecoilState, waitForAll } from 'recoil'

export const accountsState = atom<Array<{ address: string; name?: string }>>({
  key: 'Accounts',
  default: [],
})

export const substrateAccountsState = selector({
  key: 'SubstrateAccounts',
  get: ({ get }) => {
    const accounts = get(accountsState)
    return accounts.filter((x: any) => x['type'] !== 'ethereum')
  },
})

export const selectedAccountAddressesState = atom<string[] | undefined>({
  key: 'SelectedAccountAddresses',
  default: undefined,
})

export const selectedAccountsState = selector({
  key: 'SelectedAccounts',
  get: ({ get }) => {
    const [accounts, selectedAddresses] = get(waitForAll([accountsState, selectedAccountAddressesState]))

    if (selectedAddresses === undefined) return accounts

    return accounts.filter(({ address }) => selectedAddresses.includes(address))
  },
})

export const selectedSubstrateAccountsState = selector({
  key: 'SelectedSubstrateAccounts',
  get: ({ get }) => {
    return get(selectedAccountsState).filter((x: any) => x['type'] !== 'ethereum')
  },
})

/**
 * For non-globally selected account
 * example: staking, swapping
 */
export const selectedAccountState = atom({
  key: 'SelectedAccount',
  default: selector({
    key: 'SelectedAccount/Default',
    get: ({ get }) => get(substrateAccountsState)[0],
  }),
  effects: [storageEffect(sessionStorage)],
})

export const AccountsWatcher = () => {
  const extension = useRecoilValue(extensionState)
  const setAccounts = useSetRecoilState(accountsState)

  useEffect(() => {
    if (extension === undefined) {
      setAccounts([])
    }
  }, [extension, setAccounts])

  useEffect(() => extension?.accounts.subscribe(setAccounts), [extension?.accounts, setAccounts])

  return null
}
