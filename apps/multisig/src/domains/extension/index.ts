import { web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp'
import type { KeypairType } from '@polkadot/util-crypto/types'
import { Address } from '@util/addresses'
import { uniqBy } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { atom, useRecoilState, useSetRecoilState } from 'recoil'

import persistAtom from '../persist'
import toast from 'react-hot-toast'

export interface InjectedAccount {
  address: Address
  genesisHash?: string | null
  name?: string
  type?: KeypairType
}

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
  // extensionAllowed is used to trigger web3Enable call
  // e.g. set extensionAllowed to true when user clicks "connect wallet" button
  // if web3Enable call is successful, and we detect extension accounts, then we set extensionsDetected to true
  // which will trigger the web3AccountsSubscribe call
  const [extensionsDetected, setExtensionsDetected] = useState(false)
  const [extensionAllowed, setExtensionAllowed] = useRecoilState(extensionAllowedState)
  const [extensionLoading, setExtensionLoading] = useRecoilState(extensionLoadingState)
  const [subscribed, setSubscribed] = useState(false)
  const setAccounts = useSetRecoilState(accountsState)

  const connectWallet = useCallback(async () => {
    try {
      setExtensionLoading(true)
      // fire Connect Wallet popup and detect accounts allowed in extensions
      const extensions = await web3Enable(process.env.REACT_APP_APPLICATION_NAME ?? 'Signet')

      // if none detected, warn user and keep "Connect Wallet" button clickable by setting extensionAllowed to false
      if (extensions.length === 0) {
        toast.error('No wallet extension detected')
        setExtensionAllowed(false)
      }
      // trigger web3AccountSubscribe only if some accounts are detected
      // otherwise we'll have a subscription error bug
      setExtensionsDetected(extensions.length > 0)
    } catch (e) {
      console.error(e)
      setExtensionsDetected(false)
    } finally {
      setExtensionLoading(false)
    }
  }, [setExtensionAllowed, setExtensionLoading])

  useEffect(() => {
    if (extensionAllowed && !extensionLoading && !extensionsDetected) {
      connectWallet()
    }
  }, [connectWallet, extensionAllowed, extensionLoading, extensionsDetected])

  // subscribe to extension accounts - we only subscribe once per session, don't need to unsubscribe / re-subscribe
  useEffect(() => {
    if (!extensionsDetected || subscribed) return

    setSubscribed(true)
    web3AccountsSubscribe(accounts => {
      const uniqueAccounts = uniqBy(accounts, account => account.address).map(account => {
        const address = Address.fromSs58(account.address)
        if (!address) throw Error("Can't parse address from web3AccountsSubscribe!")
        return {
          ...account,
          ...account.meta,
          address,
        }
      })

      setAccounts(uniqueAccounts)

      // if all accounts disconnected, set extensionAllowed to false
      // so connect wallet buttons will be clickable again
      setExtensionAllowed(accounts.length > 0)
      setExtensionsDetected(accounts.length > 0)
    }).catch(e => {
      console.error(e)
      setSubscribed(false)
    })
  }, [extensionsDetected, setAccounts, setExtensionAllowed, subscribed])

  return null
}
