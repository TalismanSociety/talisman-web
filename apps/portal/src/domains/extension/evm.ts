import { wagmiAccountsState } from '@domains/accounts/recoils'
import { storageEffect } from '@domains/common/effects'
import { jsonParser, string } from '@recoiljs/refine'
import { toast } from '@talismn/ui'
import { injected } from '@wagmi/connectors'
import { watchAccount as watchWagmiAccount } from '@wagmi/core'
import { createStore, type EIP6963ProviderDetail } from 'mipd'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useSyncExternalStore } from 'react'
import { atom, useRecoilState, useSetRecoilState } from 'recoil'
import { useConnect, useConnectors, useDisconnect, useAccount as useWagmiAccount } from 'wagmi'
import { wagmiConfig } from './wagmi'

export const connectedEip6963RdnsState = atom<string | undefined>({
  key: 'ConnectedEip6963Rdns',
  default: undefined,
  effects: [storageEffect(localStorage, { key: 'connected-eip-6963-provider', parser: jsonParser(string()) })],
})

const eip6963Store = createStore()

export const useEip6963Providers = () => useSyncExternalStore(eip6963Store.subscribe, eip6963Store.getProviders)

export const useConnectEip6963 = () => {
  const setConnectedProvider = useSetRecoilState(connectedEip6963RdnsState)

  return {
    connect: (provider: EIP6963ProviderDetail) => {
      setConnectedProvider(provider.info.rdns)
    },
    disconnect: () => setConnectedProvider(undefined),
  }
}

export const useEvmExtensionEffect = () => {
  const connectors = useConnectors()
  const { connectAsync } = useConnect()
  const { disconnectAsync } = useDisconnect()

  const [connectedEip6963Rdns, setConnectedEip6963Rdns] = useRecoilState(connectedEip6963RdnsState)

  const eip6963Providers = useEip6963Providers()

  useEffect(() => {
    if (connectedEip6963Rdns === undefined) {
      void disconnectAsync()
    }
  }, [connectedEip6963Rdns, connectors, disconnectAsync])

  const posthog = usePostHog()

  useEffect(() => {
    if (connectedEip6963Rdns !== undefined) {
      void (async () => {
        const providerToConnect = eip6963Providers.find(x => x.info.rdns === connectedEip6963Rdns)
        await disconnectAsync()

        if (providerToConnect !== undefined) {
          try {
            await connectAsync({
              connector: injected({
                target: {
                  id: providerToConnect.info.uuid,
                  name: providerToConnect.info.name,
                  icon: providerToConnect.info.icon,
                  provider: providerToConnect.provider,
                },
              }),
            })

            posthog.capture('EVM extensions connected', { $set: { evmExtensions: [providerToConnect.info.rdns] } })
          } catch (error) {
            setConnectedEip6963Rdns(undefined)
            toast.error('Wallet connection declined')
            console.error(error)
          }
        }
      })()
    }
  }, [connectAsync, connectedEip6963Rdns, disconnectAsync, eip6963Providers, posthog, setConnectedEip6963Rdns])

  const { address } = useWagmiAccount()
  const setWagmiAccounts = useSetRecoilState(wagmiAccountsState)

  useEffect(() => {
    if (address === undefined) {
      setWagmiAccounts([])
    }

    if (address !== undefined) {
      setWagmiAccounts([{ address, type: 'ethereum', canSignEvm: true }])
    }

    const unwatch = watchWagmiAccount(wagmiConfig, {
      onChange: account => {
        if (account.address === undefined) {
          setWagmiAccounts([])
        }

        if (account.isConnected && account.address !== undefined) {
          setWagmiAccounts([{ address: account.address, type: 'ethereum', canSignEvm: true }])
        }
      },
    })

    return () => unwatch()
  }, [address, setWagmiAccounts])
}
