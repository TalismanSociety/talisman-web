import { substrateInjectedAccountsState, wagmiAccountsState } from '@domains/accounts/recoils'
import { storageEffect } from '@domains/common/effects'
import { web3Enable } from '@polkadot/extension-dapp'
import type { InjectedWindow } from '@polkadot/extension-inject/types'
import { connect as wagmiConnect, watchAccount as watchWagmiAccount, getAccount as getWagmiAccount } from '@wagmi/core'
import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'
import { atom, useRecoilState, useSetRecoilState } from 'recoil'
import { wagmiInjectedConnector } from './wagmi'

export const allowExtensionConnectionState = atom<boolean | null>({
  key: 'allow-extension-connection',
  default: null,
  effects: [storageEffect(localStorage)],
})

export const ExtensionWatcher = () => {
  const posthog = usePostHog()
  const [allowExtensionConnection, setAllowExtensionConnection] = useRecoilState(allowExtensionConnectionState)
  const setInjectedAccounts = useSetRecoilState(substrateInjectedAccountsState)

  useEffect(() => {
    if (!allowExtensionConnection) {
      return setInjectedAccounts([])
    }

    const unsubscribesPromise = web3Enable(import.meta.env.REACT_APP_APPLICATION_NAME ?? 'Talisman').then(
      async extensions => {
        posthog?.capture('Substrate extensions connected', {
          $set: { substrateExtensions: extensions.map(x => x.name) },
        })

        return extensions.map(extension =>
          extension.accounts.subscribe(accounts =>
            setInjectedAccounts(
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
  }, [allowExtensionConnection, posthog, setInjectedAccounts])

  const setWagmiAccounts = useSetRecoilState(wagmiAccountsState)

  useEffect(() => {
    if (!allowExtensionConnection) {
      setWagmiAccounts([])
      void wagmiInjectedConnector.disconnect()
    }

    if (allowExtensionConnection) {
      void wagmiConnect({ connector: wagmiInjectedConnector })
    }

    const existingAccount = getWagmiAccount()
    if (existingAccount.address !== undefined) {
      setWagmiAccounts([{ address: existingAccount.address, type: 'ethereum', canSignEvm: true }])
    }

    const unwatch = watchWagmiAccount(account => {
      if (account.address === undefined) {
        setWagmiAccounts([])
      }

      if (account.isConnected && account.address !== undefined) {
        setWagmiAccounts([{ address: account.address, type: 'ethereum', canSignEvm: true }])
      }
    })

    return () => unwatch()
  }, [allowExtensionConnection, setWagmiAccounts])

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
