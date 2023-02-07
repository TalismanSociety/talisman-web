import type { InjectedWindow } from '@polkadot/extension-inject/types'
import { atom } from 'recoil'

const getConnectedExtension = async () => {
  const source = localStorage.getItem('@talisman-connect/selected-wallet-name')

  if (source === null) return undefined

  try {
    return await (globalThis as InjectedWindow).injectedWeb3?.[source]?.enable?.(
      process.env.REACT_APP_APPLICATION_NAME ?? 'Talisman'
    )
  } catch {
    return undefined
  }
}

export const extensionState = atom({
  key: 'Extension',
  default: getConnectedExtension(),
  effects: [
    ({ setSelf }) => {
      const listener = () => getConnectedExtension().then(setSelf)

      document.addEventListener('@talisman-connect/wallet-selected', listener)

      return () => document.removeEventListener('@talisman-connect/wallet-selected', listener)
    },
  ],
})
