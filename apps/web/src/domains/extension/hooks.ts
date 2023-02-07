import type { InjectedWindow } from '@polkadot/extension-inject/types'
import { useEffect } from 'react'

export const useTalismanAutoConnectEffect = () => {
  useEffect(() => {
    if (globalThis.localStorage.getItem('@talisman-connect/selected-wallet-name') === null) {
      const talisman = (globalThis as InjectedWindow).injectedWeb3?.talisman

      if (talisman !== undefined && talisman.enable !== undefined) {
        talisman
          .enable(process.env.REACT_APP_APPLICATION_NAME)
          .then(() => globalThis.localStorage.setItem('@talisman-connect/selected-wallet-name', 'talisman'))
      }
    }
  }, [])
}
