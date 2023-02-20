import { injectedAccountsState } from '@domains/accounts/recoils'
import { storageEffect } from '@domains/common/effects'
import { web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp'
import { useEffect } from 'react'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'

export const allowExtensionConnectionState = atom({
  key: 'allow-extension-connection',
  default: false,
  effects: [storageEffect(localStorage)],
})

export const ExtensionWatcher = () => {
  const allowExtensionConnection = useRecoilValue(allowExtensionConnectionState)
  const setAccounts = useSetRecoilState(injectedAccountsState)

  useEffect(() => {
    if (!allowExtensionConnection) {
      return
    }

    const unsubscribePromise = web3Enable(process.env.REACT_APP_APPLICATION_NAME ?? 'Talisman').then(() =>
      web3AccountsSubscribe(accounts => setAccounts(accounts.map(account => ({ ...account, ...account.meta }))))
    )

    return () => {
      unsubscribePromise.then(unsubscribe => unsubscribe())
    }
  }, [allowExtensionConnection, setAccounts])

  return null
}
