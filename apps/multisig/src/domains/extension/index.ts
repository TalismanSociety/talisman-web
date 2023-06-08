import { web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp'
import type { InjectedAccount } from '@polkadot/extension-inject/types'
import { uniqBy } from 'lodash'
import { useEffect } from 'react'
import { atom, useRecoilState, useSetRecoilState } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export type ExternalAccount = InjectedAccount & {
  readonly?: boolean
}

export const accountsState = atom<ExternalAccount[]>({
  key: 'Accounts',
  default: [],
})

export const extensionAllowedState = atom<boolean>({
  key: 'AllowExtension',
  default: false,
  effects_UNSTABLE: [persistAtom],
})

export const extensionLoadingState = atom<boolean>({
  key: 'ExtensionLoading',
  default: false,
})

export const ExtensionWatcher = () => {
  const [extensionAllowed] = useRecoilState(extensionAllowedState)
  const setExtensionLoading = useSetRecoilState(extensionLoadingState)
  const setAccounts = useSetRecoilState(accountsState)

  useEffect(() => {
    if (!extensionAllowed) {
      return setAccounts([])
    }

    setExtensionLoading(true)
    const unsubscribePromise = web3Enable(process.env.REACT_APP_APPLICATION_NAME ?? 'Talisman')
      .then(() =>
        web3AccountsSubscribe(accounts =>
          setAccounts(uniqBy(accounts, account => account.address).map(account => ({ ...account, ...account.meta })))
        )
      )
      .finally(() => {
        setExtensionLoading(false)
      })

    return () => {
      unsubscribePromise.then(unsubscribe => unsubscribe())
    }
  })

  return null
}
