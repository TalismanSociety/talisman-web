import { injectedAccountsState } from '@domains/accounts/recoils'
import { storageEffect } from '@domains/common/effects'
import { web3Enable } from '@polkadot/extension-dapp'
import type { InjectedWindow } from '@polkadot/extension-inject/types'
import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'
import { atom, useRecoilState, useSetRecoilState } from 'recoil'
import { wagmiInjectedConnector } from './wagmi'
import { connect as wagmiConnect } from '@wagmi/core'
import { Maybe } from '@util/monads'

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
      void wagmiInjectedConnector.disconnect()
      return setAccounts([])
    }

    const subscribeToExtensions = async () => {
      const substrateExtensions = await web3Enable(import.meta.env.REACT_APP_APPLICATION_NAME ?? 'Talisman').catch(
        () => undefined
      )

      const evmAccount = Maybe.of(
        await wagmiConnect({ connector: wagmiInjectedConnector }).catch(() => undefined)
      ).mapOrUndefined(x => ({ address: x.account, type: 'ethereum' as const }))

      if (substrateExtensions !== undefined) {
        posthog?.capture('Substrate extensions connected', {
          $set: { substrateExtensions: substrateExtensions.map(x => x.name) },
        })

        return substrateExtensions.map(extension =>
          extension.accounts.subscribe(accounts => {
            const substrateExtensionAccounts = accounts.map(account => ({
              ...account,
              // @ts-expect-error
              readonly: Boolean(account.readonly),
              // @ts-expect-error
              partOfPortfolio: Boolean(account.partOfPortfolio),
            }))

            if (substrateExtensionAccounts.some(x => x.address === evmAccount?.address) || evmAccount === undefined) {
              setAccounts(substrateExtensionAccounts)
            } else {
              setAccounts([evmAccount, ...substrateExtensionAccounts])
            }
          })
        )
      }

      if (evmAccount !== undefined) {
        setAccounts([evmAccount])
        return []
      }

      return []
    }

    const unsubscribesPromise = subscribeToExtensions()

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
