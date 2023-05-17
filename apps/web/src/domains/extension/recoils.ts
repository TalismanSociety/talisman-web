import { injectedAccountsState } from '@domains/accounts/recoils'
import { storageEffect } from '@domains/common/effects'
import { web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp'
import type { InjectedWindow } from '@polkadot/extension-inject/types'
import { uniqBy } from 'lodash'
import { useEffect } from 'react'
import { atom, useRecoilState, useSetRecoilState } from 'recoil'

export const allowExtensionConnectionState = atom<boolean | null>({
  key: 'allow-extension-connection',
  default: null,
  effects: [storageEffect(localStorage)],
})

export const ExtensionWatcher = () => {
  const [allowExtensionConnection, setAllowExtensionConnection] = useRecoilState(allowExtensionConnectionState)
  const setAccounts = useSetRecoilState(injectedAccountsState)

  useEffect(() => {
    if (!allowExtensionConnection) {
      return setAccounts([])
    }

    const unsubscribePromise = web3Enable(import.meta.env.REACT_APP_APPLICATION_NAME ?? 'Talisman').then(
      async () =>
        await web3AccountsSubscribe(accounts =>
          setAccounts(uniqBy(accounts, account => account.address).map(account => ({ ...account, ...account.meta })))
        )
    )

    return () => {
      void unsubscribePromise.then(unsubscribe => unsubscribe())
    }
  }, [allowExtensionConnection, setAccounts])

  // Auto connect on launch if Talisman extension is installed
  // and user has not explicitly disable wallet connection
  useEffect(
    () => {
      if (
        (globalThis as InjectedWindow).injectedWeb3?.['talisman'] !== undefined &&
        allowExtensionConnection !== false
      ) {
        setAllowExtensionConnection(true)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return null
}
