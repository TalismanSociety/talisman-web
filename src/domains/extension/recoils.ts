import { web3Enable, web3FromSource } from '@polkadot/extension-dapp'
import { atom } from 'recoil'

const getConnectedExtension = async () => {
  const source = localStorage.getItem('@talisman-connect/selected-wallet-name')

  if (source === null) return undefined

  await web3Enable('Talisman')

  try {
    return await web3FromSource(source)
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
