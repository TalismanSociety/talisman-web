import { isWeb3Injected } from '@polkadot/extension-dapp'
import { useEffect, useState } from 'react'

export const useIsWeb3Injected = () => {
  const [injected, setInjected] = useState(isWeb3Injected)

  useEffect(() => {
    const listener = () => setInjected(isWeb3Injected)

    window.addEventListener('focus', listener)

    return () => window.removeEventListener('focus', listener)
  }, [])

  return injected
}
