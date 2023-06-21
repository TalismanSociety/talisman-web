import { web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp'
import type { InjectedAccount as InjectedAccountPjs } from '@polkadot/extension-inject/types'
import type { InjectedWindow } from '@polkadot/extension-inject/types'
import { uniqBy } from 'lodash'
import { useEffect } from 'react'
import { atom, useRecoilState, useSetRecoilState } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export type InjectedAccount = InjectedAccountPjs

export const accountsState = atom<InjectedAccount[]>({
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
  const [extensionAllowed, setExtensionAllowed] = useRecoilState(extensionAllowedState)
  const [extensionLoading, setExtensionLoading] = useRecoilState(extensionLoadingState)
  const setAccounts = useSetRecoilState(accountsState)

  useEffect(() => {
    if (extensionLoading) {
      setTimeout(() => {
        setExtensionLoading(false)
      }, 1000)
    }
  }, [extensionLoading, setExtensionLoading])

  useEffect(() => {
    if (!extensionAllowed) {
      return
    }

    setExtensionLoading(true)
    const unsubscribePromise = web3Enable(process.env.REACT_APP_APPLICATION_NAME ?? 'Talisman')
      .then(() => {
        return web3AccountsSubscribe(accounts => {
          setAccounts(uniqBy(accounts, account => account.address).map(account => ({ ...account, ...account.meta })))
          setExtensionLoading(false)
        })
      })
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
