import { storageEffect } from '@domains/common/effects'
import { web3Enable } from '@polkadot/extension-dapp'
import { useEffect } from 'react'
import { atom, useRecoilValue } from 'recoil'

export const allowExtensionConnectionState = atom({
  key: 'allow-extension-connection',
  default: false,
  effects: [storageEffect(localStorage)],
})

export const ExtensionWatcher = () => {
  const allowExtensionConnection = useRecoilValue(allowExtensionConnectionState)

  useEffect(() => {
    if (allowExtensionConnection) {
      web3Enable(process.env.REACT_APP_APPLICATION_NAME ?? 'Talisman')
    }
  }, [allowExtensionConnection])

  return null
}
