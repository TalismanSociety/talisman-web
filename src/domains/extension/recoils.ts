import { web3Enable, web3FromSource } from '@polkadot/extension-dapp'
import { useEffect } from 'react'
import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil'

const getConnectedExtension = async () => {
  const source = localStorage.getItem('@talisman-connect/selected-wallet-name')

  if (source === null) return undefined

  await web3Enable('Talisman')

  try {
    return await web3FromSource(source)
  } catch {
    return undefined
  }
}

export const extensionState = atom({
  key: 'Extension',
  default: getConnectedExtension(),
  effects: [
    ({ setSelf }) => {
      const listener = () => getConnectedExtension().then(setSelf)

      document.addEventListener('@talisman-connect/wallet-selected', listener)

      return () => document.removeEventListener('@talisman-connect/wallet-selected', listener)
    },
  ],
})

export const accountsState = atom<Array<{ address: string; name?: string }>>({
  key: 'Extension/Accounts',
  default: [],
})

export const AccountsWatcher = () => {
  const extension = useRecoilValue(extensionState)
  const setAccounts = useSetRecoilState(accountsState)

  useEffect(() => extension?.accounts.subscribe(setAccounts), [extension?.accounts, setAccounts])

  return null
}

export const polkadotAccountsState = selector({
  key: 'PolkadotAccounts',
  get: ({ get }) => {
    const accounts = get(accountsState)
    return accounts.filter((x: any) => x['type'] !== 'ethereum')
  },
})
