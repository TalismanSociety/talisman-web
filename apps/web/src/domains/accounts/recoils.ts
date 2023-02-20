import { web3AccountsSubscribe } from '@polkadot/extension-dapp'
import type { InjectedAccount } from '@polkadot/extension-inject/types'
import { useEffect } from 'react'
import { DefaultValue, atom, selector, useSetRecoilState, waitForAll } from 'recoil'

export type Account = InjectedAccount & {
  readonly?: boolean
}

export const injectedAccountsState = atom<Account[]>({
  key: 'InjectedAccounts',
  default: [],
})

export const _readOnlyAccountsState = atom<Account[]>({
  key: '_ReadonlyAccounts',
  default: [],
})

export const readOnlyAccountsState = selector<Account[]>({
  key: 'ReadonlyAccounts',
  get: ({ get }) => get(_readOnlyAccountsState).map(x => ({ ...x, readonly: true })),
  set: ({ set }, newValue) =>
    newValue instanceof DefaultValue
      ? []
      : set(
          _readOnlyAccountsState,
          newValue.map(x => ({ ...x, readonly: true }))
        ),
})

export const accountsState = selector({
  key: 'Accounts',
  get: ({ get }) => [...get(injectedAccountsState), ...get(readOnlyAccountsState)],
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
    const [accounts, injectedAccounts, selectedAddresses] = get(
      waitForAll([accountsState, injectedAccountsState, selectedAccountAddressesState])
    )

    if (selectedAddresses === undefined) return injectedAccounts

    return accounts.filter(({ address }) => selectedAddresses.includes(address))
  },
})

// For legacy components that only support single account selection
export const legacySelectedAccountState = selector({
  key: 'LegacySelectedAccounts',
  get: ({ get }) => {
    const [accounts, selectedAddresses] = get(waitForAll([accountsState, selectedAccountAddressesState]))

    if (selectedAddresses === undefined) return undefined

    return accounts.filter(({ address }) => selectedAddresses.includes(address))[0]
  },
})

export const selectedSubstrateAccountsState = selector({
  key: 'SelectedSubstrateAccounts',
  get: ({ get }) => {
    return get(selectedAccountsState).filter((x: any) => x['type'] !== 'ethereum')
  },
})

export const AccountsWatcher = () => {
  const setAccounts = useSetRecoilState(injectedAccountsState)

  useEffect(() => {
    const unsubscribePromise = web3AccountsSubscribe(accounts => {
      console.log(accounts)
      setAccounts(accounts.map(account => ({ ...account, ...account.meta })))
    })

    return () => {
      unsubscribePromise.then(unsubscribe => unsubscribe())
    }
  }, [setAccounts])

  return null
}
