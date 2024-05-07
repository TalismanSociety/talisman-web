import { wagmiAccountsState } from '@domains/accounts/recoils'
import { toast } from '@talismn/ui'
import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { useAccount, useConnect, useConnections, useConnectors } from 'wagmi'

export const useEvmConnectors = () => useConnectors().filter(connector => connector.id !== 'injected')

export const useConnectEvm = () => {
  const base = useConnect()

  useEffect(() => {
    if (base.error !== null) {
      toast.error('Wallet connection declined')
    }
  }, [base.error])

  return base
}

export const useEvmExtensionEffect = () => {
  const posthog = usePostHog()
  const connections = useConnections()

  useEffect(() => {
    if (connections.length > 0) {
      posthog.capture('EVM extensions connected', {
        $set: { evmExtensions: connections.map(connection => connection.connector.id) },
      })
    }
  }, [connections, connections.length, posthog])

  const { addresses } = useAccount()
  const setWagmiAccounts = useSetRecoilState(wagmiAccountsState)

  useEffect(() => {
    setWagmiAccounts(addresses?.map(address => ({ address, type: 'ethereum', canSignEvm: true })) ?? [])
  }, [addresses, setWagmiAccounts])
}
