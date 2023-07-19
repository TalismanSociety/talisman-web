import { injectedAccountsState } from '@domains/accounts/recoils'
import { storageEffect } from '@domains/common/effects'
import { web3Enable } from '@polkadot/extension-dapp'
import type { InjectedWindow } from '@polkadot/extension-inject/types'
import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'
import { atom, useRecoilState, useSetRecoilState } from 'recoil'

export const allowExtensionConnectionState = atom<boolean | null>({
  key: 'allow-extension-connection',
  default: null,
  effects: [storageEffect(localStorage)],
})

export const ExtensionWatcher = () => {
  const posthog = usePostHog()
  const [allowExtensionConnection, setAllowExtensionConnection] = useRecoilState(allowExtensionConnectionState)
  const setAccounts = useSetRecoilState(injectedAccountsState)

  useEffect(() => {
    if (!allowExtensionConnection) {
      return setAccounts([])
    }

    const unsubscribesPromise = web3Enable(import.meta.env.REACT_APP_APPLICATION_NAME ?? 'Talisman').then(
      async extensions => {
        posthog?.capture('Substrate extensions connected', {
          $set: { substrateExtensions: extensions.map(x => x.name) },
        })

        return extensions.map(extension =>
          extension.accounts.subscribe(accounts =>
            setAccounts(
              accounts.map(account => ({
                ...account,
                // @ts-expect-error
                readonly: Boolean(account.readonly),
                // @ts-expect-error
                partOfPortfolio: Boolean(account.partOfPortfolio),
              }))
            )
          )
        )
      }
    )

    return () => {
      void unsubscribesPromise.then(unsubscribes => unsubscribes.map(unsubscribe => unsubscribe()))
    }
  }, [allowExtensionConnection, posthog, setAccounts])

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
