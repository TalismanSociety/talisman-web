import { getWallets } from '@talismn/connect-wallets'
import { useEffect, useState } from 'react'

export function useIsAnyWalletInstalled() {
  const [isAnyWalletInstalled, setIsAnyWalletInstalled] = useState<boolean>()
  useEffect(() => {
    const wallets = getWallets()
    const installedWallets = wallets.filter(w => w.installed)
    setIsAnyWalletInstalled(installedWallets.length > 0)
  }, [])
  return isAnyWalletInstalled
}
