import { web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp'
import type { InjectedAccount as InjectedAccountPjs } from '@polkadot/extension-inject/types'
import type { InjectedWindow } from '@polkadot/extension-inject/types'
import { uniqBy } from 'lodash'
import { useEffect, useState } from 'react'
import { atom, useRecoilState, useSetRecoilState } from 'recoil'

export type InjectedAccount = InjectedAccountPjs

export const accountsState = atom<InjectedAccount[]>({
  key: 'Accounts',
  default: [],
})

export const extensionAllowedState = atom<boolean>({
  key: 'AllowExtension',
  default: false,
})

export const extensionLoadingState = atom<boolean>({
  key: 'ExtensionLoading',
  default: false,
})

export const useSelectedSigner = () => {
  const [extensionAccounts] = useRecoilState(accountsState)
  const [selectedSigner, setSelectedSigner] = useState<InjectedAccount | undefined>(extensionAccounts[0])

  // Ensure selected signer gets set if it is disconnected
  useEffect(() => {
    if (!extensionAccounts.map(a => a.address).includes(selectedSigner?.address || 'invalid-address')) {
      setSelectedSigner(extensionAccounts[0])
    }
  }, [selectedSigner, extensionAccounts])

  return [selectedSigner, setSelectedSigner] as const
}

export const ExtensionWatcher = () => {
  const [extensionAllowed, setExtensionAllowed] = useRecoilState(extensionAllowedState)
  const setExtensionLoading = useSetRecoilState(extensionLoadingState)
  const setAccounts = useSetRecoilState(accountsState)

  useEffect(() => {
    if (!extensionAllowed) {
      return
    }

    setExtensionLoading(true)
    const unsubscribePromise = web3Enable(process.env.REACT_APP_APPLICATION_NAME ?? 'Talisman')
      .then(() =>
        web3AccountsSubscribe(accounts => {
          setAccounts(uniqBy(accounts, account => account.address).map(account => ({ ...account, ...account.meta })))
          setExtensionLoading(false)
        })
      )
      .catch(e => {
        console.error(e)
        setExtensionLoading(false)
        return () => {}
      })

    return () => {
      unsubscribePromise.then(unsubscribe => unsubscribe())
    }
  }, [extensionAllowed, setAccounts, setExtensionLoading])

  // Auto connect on launch if Talisman extension is installed
  // and user has not explicitly disable wallet connection
  useEffect(
    () => {
      if ((globalThis as InjectedWindow).injectedWeb3?.talisman !== undefined && extensionAllowed !== false) {
        setExtensionAllowed(true)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return null
}
