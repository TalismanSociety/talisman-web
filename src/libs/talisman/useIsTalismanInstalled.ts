import { getWallets } from '@talisman-connect/wallets'
import { useEffect, useState } from 'react'

export function useTalismanInstalled() {
  const [talismanInstalled, setTalismanInstalled] = useState<boolean>()
  useEffect(() => {
    const wallets = getWallets()
    const talismanInstalled = wallets.filter(wallet => wallet.installed && wallet.extensionName === 'talisman')
    setTalismanInstalled(talismanInstalled.length > 0)
  }, [])
  return talismanInstalled
}
